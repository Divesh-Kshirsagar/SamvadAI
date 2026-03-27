"""LangGraph pipeline node functions for complaint analysis."""
import json
import re
from datetime import datetime, timedelta, timezone

from django.conf import settings
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama
from tenacity import retry, stop_after_attempt, wait_fixed

from .prompts import (
    CLASSIFY_PROMPT, SENTIMENT_PROMPT, SEVERITY_PROMPT,
    DUPLICATE_PROMPT, DRAFT_PROMPT
)

# Maximum number of existing cluster tags passed to the duplicate-detection
# prompt. Fetching all tags would eventually exceed the LLM context window
# as the complaint volume grows; K=10 keeps the prompt small and focused
# on semantically nearby clusters.
TOP_K_CLUSTER_TAGS = 10

# Hard token budget for the cluster-tag list injected into DUPLICATE_PROMPT.
# We estimate token count at 4 characters per token (a conservative average
# for English mixed with short identifiers). If the K selected tags still
# exceed this limit we truncate right-to-left until they fit, ensuring the
# prompt never balloons past the intended context window allocation.
MAX_CLUSTER_CONTEXT_TOKENS = 1500
_CHARS_PER_TOKEN = 4


def _use_local() -> bool:
    """True when the local Ollama backend should be used instead of Gemini."""
    return (
        os.getenv("USE_LOCAL_LLM", "false").lower() == "true"
        or not getattr(settings, "GOOGLE_API_KEY", None)
    )


def get_llm_json():
    """LLM configured for **structured JSON output**.

    Used by: classify_node, sentiment_node, severity_node, duplicate_node.

    Ollama's ``format="json"`` parameter constrains phi3 to emit only valid
    JSON tokens, which is essential for reliable ``json.loads()`` parsing.
    Gemini follows the JSON instruction in the prompt itself without needing
    a separate format flag.
    """
    if _use_local():
        return ChatOllama(
            model="phi3",
            temperature=0.1,
            format="json",  # forces phi3 to emit only valid JSON tokens
        )
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.1,
    )


def get_llm_text():
    """LLM configured for **free-form plain-text output**.

    Used by: draft_node.

    DRAFT_PROMPT explicitly instructs the model to respond with plain prose
    and no JSON. Setting ``format="json"`` on Ollama would directly contradict
    that instruction and corrupt the output, so this factory omits it entirely.
    """
    if _use_local():
        return ChatOllama(
            model="phi3",
            temperature=0.1,
            # No format="json" — draft output must be human-readable prose.
        )
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.1,
    )


def _parse_json(text: str) -> dict:
    """Extract JSON from LLM output, handling markdown fences."""
    text = text.strip()
    # Strip markdown code fence if present
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Check if json can be recovered with a regex
        match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        raise ValueError(f"Failed to extract JSON from LLM response. Raw text: {text}")


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
def classify_node(state: dict) -> dict:
    # JSON mode: CLASSIFY_PROMPT returns {"category": ..., "product": ...}
    llm = get_llm_json()
    prompt = CLASSIFY_PROMPT.format(
        raw_text=state["raw_text"],
        account_type=state["account_type"],
        channel=state["channel"],
    )
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {**state, "category": result["category"], "product": result.get("product", "")}


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
def sentiment_node(state: dict) -> dict:
    # JSON mode: SENTIMENT_PROMPT returns {"sentiment": ...}
    llm = get_llm_json()
    prompt = SENTIMENT_PROMPT.format(raw_text=state["raw_text"])
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {**state, "sentiment": result["sentiment"]}


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
def severity_node(state: dict) -> dict:
    # JSON mode: SEVERITY_PROMPT returns {"priority": ..., "sla_hours": ...}
    llm = get_llm_json()
    prompt = SEVERITY_PROMPT.format(
        raw_text=state["raw_text"],
        category=state["category"],
        sentiment=state["sentiment"],
        account_type=state["account_type"],
    )
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    sla_hours = int(result.get("sla_hours", 24))
    sla_deadline = datetime.now(timezone.utc) + timedelta(hours=sla_hours)
    return {
        **state,
        "ai_priority": result["priority"],
        "sla_hours": sla_hours,
        "sla_deadline": sla_deadline,
    }


def _get_relevant_cluster_tags(category: str, channel: str) -> str:
    """Return a token-budget-aware string of the top-K most relevant cluster
    tags for the current complaint.

    Retrieval strategy (no vector store required):
      1. Prefer tags whose complaints share the same *category* — these are
         semantically closest to the new complaint.
      2. Among those, also include tags from the same *channel* to surface
         channel-specific issue patterns.
      3. Sort by recency (``analyzed_at`` descending) so the most active
         clusters appear first.
      4. De-duplicate and cap at TOP_K_CLUSTER_TAGS.
      5. Truncate the joined string to MAX_CLUSTER_CONTEXT_TOKENS to
         guarantee the prompt stays within the LLM context window budget
         even if individual tags are unusually long.
    """
    # Import here to avoid circular imports at module load
    from complaints.models import AnalysisResult

    base_qs = (
        AnalysisResult.objects
        .exclude(cluster_tag="")
        .order_by("-analyzed_at")
    )

    # Collect tags matching category, then channel, then merge + de-duplicate
    # while preserving relevance order (category matches first).
    category_tags = list(
        base_qs.filter(category=category)
        .values_list("cluster_tag", flat=True)
        .distinct()[: TOP_K_CLUSTER_TAGS]
    )
    channel_tags = list(
        base_qs.filter(channel=channel)
        .exclude(cluster_tag__in=category_tags)
        .values_list("cluster_tag", flat=True)
        .distinct()[: TOP_K_CLUSTER_TAGS]
    )

    # Merge and cap at K
    candidates = (category_tags + channel_tags)[:TOP_K_CLUSTER_TAGS]

    if not candidates:
        return "none"

    # Token-budget guard: estimate tokens as len(text) / _CHARS_PER_TOKEN.
    # Drop tags from the tail until the joined string fits within the budget.
    # This prevents context-window overflow as the cluster vocabulary grows.
    max_chars = MAX_CLUSTER_CONTEXT_TOKENS * _CHARS_PER_TOKEN
    while candidates:
        joined = ", ".join(candidates)
        if len(joined) <= max_chars:
            return joined
        candidates.pop()

    return "none"


@retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
def duplicate_node(state: dict) -> dict:
    # JSON mode: DUPLICATE_PROMPT returns {"cluster_tag": ..., "is_duplicate": ...}
    llm = get_llm_json()
    prompt = DUPLICATE_PROMPT.format(
        raw_text=state["raw_text"],
        category=state["category"],
        channel=state["channel"],
        existing_clusters=_get_relevant_cluster_tags(
            category=state["category"],
            channel=state["channel"],
        ),
    )
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {
        **state,
        "cluster_tag": result.get("cluster_tag", ""),
        "is_duplicate": result.get("is_duplicate", False),
    }


def draft_node(state: dict) -> dict:
    # Text mode: DRAFT_PROMPT explicitly asks for plain prose — no JSON wrapper.
    llm = get_llm_text()
    prompt = DRAFT_PROMPT.format(
        raw_text=state["raw_text"],
        category=state["category"],
        priority=state["ai_priority"],
        sentiment=state["sentiment"],
    )
    response = llm.invoke(prompt)
    return {**state, "ai_draft": response.content.strip()}

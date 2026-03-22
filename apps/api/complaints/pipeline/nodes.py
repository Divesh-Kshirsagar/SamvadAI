"""LangGraph pipeline node functions for complaint analysis."""
import json
import re
from datetime import datetime, timedelta, timezone

from django.conf import settings
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_ollama import ChatOllama

from .prompts import (
    CLASSIFY_PROMPT, SENTIMENT_PROMPT, SEVERITY_PROMPT,
    DUPLICATE_PROMPT, DRAFT_PROMPT
)


def get_llm():
    """Returns either Gemini or local Ollama depending on configuration."""
    use_local = os.getenv("USE_LOCAL_LLM", "false").lower() == "true"
    
    # If explicitly set to local OR if Google key is missing, fallback to Ollama
    if use_local or not getattr(settings, "GOOGLE_API_KEY", None):
        return ChatOllama(
            model="phi3",
            temperature=0.1,
            format="json", # Phi3 is excellent at JSON with this parameter
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
    return json.loads(text)


def classify_node(state: dict) -> dict:
    llm = get_llm()
    prompt = CLASSIFY_PROMPT.format(
        raw_text=state["raw_text"],
        account_type=state["account_type"],
        channel=state["channel"],
    )
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {**state, "category": result["category"], "product": result.get("product", "")}


def sentiment_node(state: dict) -> dict:
    llm = get_llm()
    prompt = SENTIMENT_PROMPT.format(raw_text=state["raw_text"])
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {**state, "sentiment": result["sentiment"]}


def severity_node(state: dict) -> dict:
    llm = get_llm()
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


def duplicate_node(state: dict) -> dict:
    # Import here to avoid circular imports at module load
    from complaints.models import AnalysisResult
    existing_clusters = list(
        AnalysisResult.objects.exclude(cluster_tag="")
        .values_list("cluster_tag", flat=True)
        .distinct()
    )
    llm = get_llm()
    prompt = DUPLICATE_PROMPT.format(
        raw_text=state["raw_text"],
        category=state["category"],
        channel=state["channel"],
        existing_clusters=", ".join(existing_clusters) or "none",
    )
    response = llm.invoke(prompt)
    result = _parse_json(response.content)
    return {
        **state,
        "cluster_tag": result.get("cluster_tag", ""),
        "is_duplicate": result.get("is_duplicate", False),
    }


def draft_node(state: dict) -> dict:
    llm = get_llm()
    prompt = DRAFT_PROMPT.format(
        raw_text=state["raw_text"],
        category=state["category"],
        priority=state["ai_priority"],
        sentiment=state["sentiment"],
    )
    response = llm.invoke(prompt)
    return {**state, "ai_draft": response.content.strip()}

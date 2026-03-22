"""LangGraph StateGraph for the complaint analysis pipeline."""
from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from datetime import datetime


class PipelineState(TypedDict, total=False):
    # Input fields
    complaint_id: str
    raw_text: str
    account_type: str
    channel: str
    # Intermediate
    category: str
    product: str
    sentiment: str
    ai_priority: str
    sla_hours: int
    sla_deadline: Optional[datetime]
    cluster_tag: str
    is_duplicate: bool
    ai_draft: str


def build_pipeline():
    from .nodes import (
        classify_node, sentiment_node, severity_node,
        duplicate_node, draft_node
    )

    graph = StateGraph(PipelineState)

    graph.add_node("classify", classify_node)
    graph.add_node("sentiment", sentiment_node)
    graph.add_node("severity", severity_node)
    graph.add_node("duplicate", duplicate_node)
    graph.add_node("draft", draft_node)

    graph.set_entry_point("classify")
    graph.add_edge("classify", "sentiment")
    graph.add_edge("sentiment", "severity")
    graph.add_edge("severity", "duplicate")
    graph.add_edge("duplicate", "draft")
    graph.add_edge("draft", END)

    return graph.compile()


# Singleton compiled pipeline
_pipeline = None


def get_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = build_pipeline()
    return _pipeline


def run_pipeline(complaint) -> dict:
    """Run the full analysis pipeline for a Complaint instance."""
    pipeline = get_pipeline()
    result = pipeline.invoke({
        "complaint_id": str(complaint.id),
        "raw_text": complaint.raw_text,
        "account_type": complaint.account_type,
        "channel": complaint.channel,
    })
    return result

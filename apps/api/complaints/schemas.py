"""Pydantic schemas for django-ninja API endpoints."""
from datetime import datetime
from typing import Optional
from uuid import UUID
from ninja import Schema


class ComplaintOut(Schema):
    id: UUID
    customer_name: str
    timestamp: datetime
    channel: str
    account_type: str
    raw_text: str
    actual_priority: str
    status: str
    has_analysis: bool = False


class AnalysisOut(Schema):
    category: str
    product: str
    sentiment: str
    ai_priority: str
    sla_hours: int
    sla_deadline: Optional[datetime]
    cluster_tag: str
    ai_draft: str
    analyzed_at: datetime
    duplicate_of_id: Optional[UUID] = None


class ComplaintDetailOut(Schema):
    id: UUID
    customer_name: str
    timestamp: datetime
    channel: str
    account_type: str
    raw_text: str
    actual_priority: str
    status: str
    analysis: Optional[AnalysisOut] = None


class SummaryOut(Schema):
    total: int
    urgent: int
    high: int
    medium: int
    low: int
    open_count: int
    in_progress: int
    resolved: int
    by_category: dict
    by_channel: dict
    by_priority: dict


class TrendPoint(Schema):
    date: str
    count: int


class ClusterOut(Schema):
    cluster_tag: str
    complaint_count: int
    root_cause_summary: str


class StatusUpdateIn(Schema):
    status: str

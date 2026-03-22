"""Django-Ninja API router for complaints."""
from typing import List, Optional
from uuid import UUID

from django.db.models import Count, Exists, OuterRef
from django.shortcuts import get_object_or_404
from ninja import Router

from .models import Complaint, AnalysisResult, DuplicateGroup
from .schemas import (
    ComplaintOut, ComplaintDetailOut, AnalysisOut,
    SummaryOut, TrendPoint, ClusterOut, StatusUpdateIn
)
from .pipeline.graph import run_pipeline

router = Router()


# ── Complaints ──────────────────────────────────────────────────────────────

@router.get("/", response=List[ComplaintOut], tags=["complaints"])
def list_complaints(
    request,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    channel: Optional[str] = None,
):
    qs = Complaint.objects.annotate(
        has_analysis=Exists(AnalysisResult.objects.filter(complaint=OuterRef('pk')))
    ).order_by('-timestamp')
    
    if priority:
        qs = qs.filter(actual_priority=priority)
    if status:
        qs = qs.filter(status=status)
    if channel:
        qs = qs.filter(channel=channel)
    return list(qs)


@router.get("/{complaint_id}/", response=ComplaintDetailOut, tags=["complaints"])
def get_complaint(request, complaint_id: UUID):
    complaint = get_object_or_404(Complaint, id=complaint_id)
    result = {
        "id": complaint.id,
        "customer_name": complaint.customer_name,
        "timestamp": complaint.timestamp,
        "channel": complaint.channel,
        "account_type": complaint.account_type,
        "raw_text": complaint.raw_text,
        "actual_priority": complaint.actual_priority,
        "status": complaint.status,
        "analysis": None,
    }
    if hasattr(complaint, "analysis"):
        a = complaint.analysis
        result["analysis"] = {
            "category": a.category,
            "product": a.product,
            "sentiment": a.sentiment,
            "ai_priority": a.ai_priority,
            "sla_hours": a.sla_hours,
            "sla_deadline": a.sla_deadline,
            "cluster_tag": a.cluster_tag,
            "ai_draft": a.ai_draft,
            "analyzed_at": a.analyzed_at,
            "duplicate_of_id": a.duplicate_of_id,
        }
    return result


@router.post("/{complaint_id}/analyze/", response=AnalysisOut, tags=["complaints"])
def analyze_complaint(request, complaint_id: UUID):
    complaint = get_object_or_404(Complaint, id=complaint_id)
    output = run_pipeline(complaint)
    analysis, _ = AnalysisResult.objects.update_or_create(
        complaint=complaint,
        defaults={
            "category": output.get("category", ""),
            "product": output.get("product", ""),
            "sentiment": output.get("sentiment", ""),
            "ai_priority": output.get("ai_priority", ""),
            "sla_hours": output.get("sla_hours", 24),
            "sla_deadline": output.get("sla_deadline"),
            "cluster_tag": output.get("cluster_tag", ""),
            "ai_draft": output.get("ai_draft", ""),
        },
    )
    return {
        "category": analysis.category,
        "product": analysis.product,
        "sentiment": analysis.sentiment,
        "ai_priority": analysis.ai_priority,
        "sla_hours": analysis.sla_hours,
        "sla_deadline": analysis.sla_deadline,
        "cluster_tag": analysis.cluster_tag,
        "ai_draft": analysis.ai_draft,
        "analyzed_at": analysis.analyzed_at,
        "duplicate_of_id": analysis.duplicate_of_id,
    }


@router.post("/analyze-all/", tags=["complaints"])
def analyze_all(request):
    complaints = Complaint.objects.all()
    count = 0
    for complaint in complaints:
        try:
            output = run_pipeline(complaint)
            AnalysisResult.objects.update_or_create(
                complaint=complaint,
                defaults={
                    "category": output.get("category", ""),
                    "product": output.get("product", ""),
                    "sentiment": output.get("sentiment", ""),
                    "ai_priority": output.get("ai_priority", ""),
                    "sla_hours": output.get("sla_hours", 24),
                    "sla_deadline": output.get("sla_deadline"),
                    "cluster_tag": output.get("cluster_tag", ""),
                    "ai_draft": output.get("ai_draft", ""),
                },
            )
            count += 1
        except Exception:
            pass  # Continue with remaining complaints
    return {"analyzed": count, "total": complaints.count()}


@router.patch("/{complaint_id}/status/", tags=["complaints"])
def update_status(request, complaint_id: UUID, data: StatusUpdateIn):
    complaint = get_object_or_404(Complaint, id=complaint_id)
    complaint.status = data.status
    complaint.save()
    return {"status": complaint.status}


# ── Analytics ────────────────────────────────────────────────────────────────

@router.get("/analytics/summary/", response=SummaryOut, tags=["analytics"])
def get_summary(request):
    complaints = Complaint.objects.all()
    by_category = {}
    by_channel = {}
    by_priority = {}

    analyses = AnalysisResult.objects.values("category").annotate(count=Count("id"))
    for item in analyses:
        if item["category"]:
            by_category[item["category"]] = item["count"]

    channels = complaints.values("channel").annotate(count=Count("id"))
    for item in channels:
        by_channel[item["channel"]] = item["count"]

    priorities = complaints.values("actual_priority").annotate(count=Count("id"))
    for item in priorities:
        by_priority[item["actual_priority"]] = item["count"]

    return {
        "total": complaints.count(),
        "urgent": complaints.filter(actual_priority="Urgent").count(),
        "high": complaints.filter(actual_priority="High").count(),
        "medium": complaints.filter(actual_priority="Medium").count(),
        "low": complaints.filter(actual_priority="Low").count(),
        "open_count": complaints.filter(status="Open").count(),
        "in_progress": complaints.filter(status="In Progress").count(),
        "resolved": complaints.filter(status="Resolved").count(),
        "by_category": by_category,
        "by_channel": by_channel,
        "by_priority": by_priority,
    }


@router.get("/analytics/trends/", response=List[TrendPoint], tags=["analytics"])
def get_trends(request):
    from django.db.models.functions import TruncDate
    trend_qs = (
        Complaint.objects
        .annotate(date=TruncDate("timestamp"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )
    return [{"date": str(item["date"]), "count": item["count"]} for item in trend_qs]


@router.get("/analytics/clusters/", response=List[ClusterOut], tags=["analytics"])
def get_clusters(request):
    clusters = (
        AnalysisResult.objects
        .exclude(cluster_tag="")
        .values("cluster_tag")
        .annotate(complaint_count=Count("id"))
        .order_by("-complaint_count")
    )
    result = []
    for item in clusters:
        group = DuplicateGroup.objects.filter(cluster_tag=item["cluster_tag"]).first()
        result.append({
            "cluster_tag": item["cluster_tag"],
            "complaint_count": item["complaint_count"],
            "root_cause_summary": group.root_cause_summary if group else "",
        })
    return result

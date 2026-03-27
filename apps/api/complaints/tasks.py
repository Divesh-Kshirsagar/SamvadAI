import logging
from django_rq import job
from .models import Complaint, AnalysisResult
from .pipeline.graph import run_pipeline

logger = logging.getLogger(__name__)

@job
def process_single_complaint(complaint_id):
    complaint = Complaint.objects.get(id=complaint_id)
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
    except Exception as e:
        logger.error(f"Failed to process complaint {complaint_id}: {e}")
        raise

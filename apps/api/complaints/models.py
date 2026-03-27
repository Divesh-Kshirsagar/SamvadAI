import uuid
from django.db import models


class Complaint(models.Model):
    CHANNEL_CHOICES = [
        ('Mobile App', 'Mobile App'),
        ('Email', 'Email'),
        ('WhatsApp', 'WhatsApp'),
        ('IVR', 'IVR'),
        ('In-Branch', 'In-Branch'),
        ('Social Media', 'Social Media'),
    ]
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Resolved', 'Resolved'),
    ]
    PRIORITY_CHOICES = [
        ('Urgent', 'Urgent'),
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=255)
    timestamp = models.DateTimeField()
    channel = models.CharField(max_length=50, choices=CHANNEL_CHOICES)
    account_type = models.CharField(max_length=100)
    raw_text = models.TextField()
    actual_priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.customer_name} — {self.channel} ({self.actual_priority})"


class AnalysisResult(models.Model):
    CATEGORY_CHOICES = [
        ('Loan', 'Loan'),
        ('Card', 'Card'),
        ('Digital', 'Digital'),
        ('Branch', 'Branch'),
        ('Fraud', 'Fraud'),
        ('General', 'General'),
    ]
    SENTIMENT_CHOICES = [
        ('Positive', 'Positive'),
        ('Neutral', 'Neutral'),
        ('Negative', 'Negative'),
        ('Hostile', 'Hostile'),
    ]

    complaint = models.OneToOneField(
        Complaint, on_delete=models.CASCADE, related_name='analysis'
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True)
    product = models.CharField(max_length=100, blank=True)
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, blank=True)
    ai_priority = models.CharField(max_length=20, blank=True)
    sla_hours = models.IntegerField(default=24)
    sla_deadline = models.DateTimeField(null=True, blank=True)
    duplicate_of = models.ForeignKey(
        Complaint, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='duplicates'
    )
    cluster_tag = models.CharField(max_length=100, blank=True)
    ai_draft = models.TextField(blank=True)
    analyzed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analysis for {self.complaint.customer_name}"


class DuplicateGroup(models.Model):
    cluster_tag = models.CharField(max_length=100, unique=True)
    root_cause_summary = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.cluster_tag

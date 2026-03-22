"""LangGraph pipeline prompt templates."""

CLASSIFY_PROMPT = """You are a bank complaint classifier for Union Bank of India.

Complaint text: {raw_text}
Account type: {account_type}
Channel: {channel}

Classify this complaint. Respond ONLY with valid JSON in this exact format:
{{
  "category": "<Loan|Card|Digital|Branch|Fraud|General>",
  "product": "<specific product, e.g. IMPS, Credit Card, KYC, Savings Account>"
}}"""

SENTIMENT_PROMPT = """Analyse the sentiment of this bank customer complaint.

Complaint: {raw_text}

Respond ONLY with valid JSON:
{{
  "sentiment": "<Positive|Neutral|Negative|Hostile>"
}}"""

SEVERITY_PROMPT = """You are a bank complaint triage expert.

Complaint: {raw_text}
Category: {category}
Sentiment: {sentiment}
Account type: {account_type}

Determine priority and SLA hours. Respond ONLY with valid JSON:
{{
  "priority": "<Urgent|High|Medium|Low>",
  "sla_hours": <integer: 4 for Urgent, 12 for High, 24 for Medium, 48 for Low>
}}"""

DUPLICATE_PROMPT = """Analyse if this complaint belongs to an existing cluster of complaints.

New complaint: {raw_text}
Category: {category}
Channel: {channel}

Existing cluster tags (comma-separated, may be empty): {existing_clusters}

Respond ONLY with valid JSON:
{{
  "cluster_tag": "<existing_tag or short_snake_case_new_tag>",
  "is_duplicate": <true|false>
}}"""

DRAFT_PROMPT = """You are a bank customer support agent at Union Bank of India.

Customer complaint: {raw_text}
Category: {category}
Priority: {priority}
Sentiment: {sentiment}

Write a professional, empathetic draft response (2-3 sentences). Address the issue directly.
Respond ONLY with the draft text, no JSON, no extra formatting."""

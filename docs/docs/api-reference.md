# API Reference

The SamvadAI backend exposes a RESTful interface using **Django Ninja** with strict **Pydantic** schema validation.

All endpoints are prefixed with `/api/`. When running the server locally, you can view the interactive OpenAPI (Swagger) documentation at `http://localhost:8000/api/docs`.

---

## Core Endpoints

### 1. List Complaints
- **URL**: `GET /api/complaints/`
- **Query Parameters**:
  - `priority` (optional string)
  - `status` (optional string)
  - `channel` (optional string)
- **Response**: Array of `ComplaintOut`
```json
[
  {
    "id": "uuid",
    "customer_name": "Rakesh Sharma",
    "timestamp": "2026-03-21T10:00:00Z",
    "channel": "Email",
    "account_type": "Savings",
    "raw_text": "My ATM card was swallowed...",
    "actual_priority": "High",
    "status": "Open",
    "has_analysis": false
  }
]
```

### 2. Get Complaint Details
- **URL**: `GET /api/complaints/{id}/`
- **Description**: Retrieves detailed information for a specific complaint, including its attached AI Analysis metadata if it has been analyzed.
- **Response**: `ComplaintDetailOut`
```json
{
  "id": "uuid",
  "customer_name": "Rakesh Sharma",
  "timestamp": "2026-03-21T10:00:00Z",
  "channel": "Email",
  "account_type": "Savings",
  "raw_text": "My ATM card was swallowed...",
  "actual_priority": "High",
  "status": "Open",
  "analysis": {
    "category": "Card",
    "product": "ATM",
    "sentiment": "Negative",
    "ai_priority": "Urgent",
    "sla_hours": 4,
    "sla_deadline": "2026-03-21T14:00:00Z",
    "cluster_tag": "ATM_SWALLOW",
    "ai_draft": "Dear Rakesh, we apologize...",
    "analyzed_at": "2026-03-22T10:00:00Z",
    "duplicate_of_id": null
  }
}
```

### 3. Trigger Target AI Analysis
- **URL**: `POST /api/complaints/{id}/analyze/`
- **Description**: Invokes the **LangGraph Agentic Pipeline**. This takes the raw text, pushes it through the classification, sentiment, severity, duplicate detection, and draft response nodes.
- **Response**: Extracted `AnalysisOut` JSON mapping directly to SQLite. Returns exactly the `analysis` object shown above.

### 4. Trigger Batch Analysis
- **URL**: `POST /api/complaints/analyze-all/`
- **Description**: A convenience fallback for synchronous batch processing (Note: the frontend uses sequential batching to protect local Ollama limits, but this endpoint exists for robust server-side processing or CRON jobs).
- **Response**:
```json
{
  "analyzed": 5,
  "total": 20
}
```

### 5. Update Status
- **URL**: `PATCH /api/complaints/{id}/status/`
- **Request Body**:
```json
{
  "status": "In Progress"
}
```
- **Response**: `{"status": "In Progress"}`

---

## Analytics Endpoints

### 1. Dashboard Summary
- **URL**: `GET /api/analytics/summary/`
- **Response**: `SummaryOut` (Used for generating Top-Level KPI Cards & Pie Charts)
```json
{
  "total": 20,
  "urgent": 5,
  "high": 8,
  "medium": 4,
  "low": 3,
  "open_count": 10,
  "in_progress": 5,
  "resolved": 5,
  "by_category": {
    "Card": 7,
    "Loan": 3
  },
  "by_channel": {
    "Email": 10,
    "Mobile App": 10
  },
  "by_priority": {
    "Urgent": 5
  }
}
```

### 2. Complaint Trends
- **URL**: `GET /api/analytics/trends/`
- **Description**: Provides a daily aggregation array of incoming complaint volumes.
- **Response**:
```json
[
  { "date": "2026-03-21", "count": 10 },
  { "date": "2026-03-22", "count": 10 }
]
```

### 3. Duplicate Root Cause Clusters
- **URL**: `GET /api/analytics/clusters/`
- **Description**: Returns data for the Root Cause insights cards showing identical grouped problems mapped by the AI.
- **Response**:
```json
[
  {
    "cluster_tag": "ATM_SWALLOW_INDORE",
    "complaint_count": 4,
    "root_cause_summary": "Simultaneous mechanism failure reported across 4 ATMs triggered by local power grid."
  }
]
```

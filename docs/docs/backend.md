# Backend Architecture

The SamvadAI backend is built strictly for high performance and rapid development using the following stack:

- **Django 5**: Core framework and ORM (SQLite).
- **Django-Ninja**: Fast API routing with Pydantic schema validation.
- **LangChain & LangGraph**: Agentic AI orchestration for processing complaint pipelines.

## Data Models & ER Diagram
The SQLite schema is optimized for lookup speed and historical traceability.

```mermaid
erDiagram
    COMPLAINT ||--o| ANALYSIS_RESULT : "has analysis"
    COMPLAINT ||--o{ COMPLAINT : "duplicate of"
    ANALYSIS_RESULT }|--o| DUPLICATE_GROUP : "belongs to cluster"

    COMPLAINT {
        UUID id PK
        string customer_name
        datetime timestamp
        string channel
        string account_type
        string raw_text
        string actual_priority
        string status
    }

    ANALYSIS_RESULT {
        int id PK
        string category
        string product
        string sentiment
        string ai_priority
        int sla_hours
        datetime sla_deadline
        text ai_draft
        datetime analyzed_at
    }

    DUPLICATE_GROUP {
        string cluster_tag PK
        text root_cause_summary
    }
```

## API Endpoints
All endpoints are mounted under `/api/`. For an interactive swagger interface, start the server and visit `/api/docs/`.

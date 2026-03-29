[Back to README](../../README.md)

# Backend Architecture
**This doc explains how the Django backend stores complaints, exposes APIs, and runs AI analysis.**

## Stack
- Django
- Django-Ninja (REST API + schema validation)
- SQLite (local demo DB)
- LangGraph pipeline integration

## Main backend folders
- `apps/api/api/` — Django project config (`settings.py`, `urls.py`).
- `apps/api/complaints/` — models, schemas, API routes, pipeline logic.
- `apps/api/complaints/management/commands/` — seed scripts.

## Data model (high level)

```mermaid
erDiagram
    COMPLAINT ||--o| ANALYSIS_RESULT : has_one
    COMPLAINT {
      UUID id
      string customer_name
      datetime timestamp
      string channel
      string account_type
      text raw_text
      string actual_priority
      string status
    }
    ANALYSIS_RESULT {
      int id
      string category
      string product
      string sentiment
      string ai_priority
      int sla_hours
      datetime sla_deadline
      string cluster_tag
      text ai_draft
      datetime analyzed_at
    }
```

## API routing
All API endpoints are mounted under `/api/` using Django-Ninja.

- Complaint routes: listing, detail, analyze single, analyze all, status update.
- Analytics routes: summary, trends, clusters.

See full endpoint details in [API Reference](api-reference.md).

## Local run commands

```bash
cd apps/api
uv sync
uv run python manage.py migrate
uv run python manage.py seed_complaints
uv run python manage.py runserver 0.0.0.0:8000
```

## Known limitations
- Bulk analysis is currently synchronous in the API path.
- Production security settings need stricter environment setup.
- More tests are needed around pipeline edge cases.

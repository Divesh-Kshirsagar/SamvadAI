[Back to README](../../README.md)

# SamvadAI Docs Home
**This page gives you the quickest way to understand what SamvadAI is and how the parts fit together.**

## What SamvadAI does
SamvadAI helps complaint teams process bank complaints faster.
For each complaint, it classifies category, detects sentiment, estimates priority/SLA, checks duplicate patterns, and drafts a response for agent review.

## System view

```mermaid
graph TD
    U[Bank Agent] --> W[Web App (React)]
    W --> A[API (Django-Ninja)]
    A --> DB[(SQLite)]
    A --> P[LangGraph Pipeline]
    P --> G[Gemini Cloud Model]
    P --> O[Ollama Local Model]
```

## Core workflow
1. Complaint arrives from any channel.
2. Backend stores it as a complaint record.
3. AI pipeline runs analysis steps.
4. UI shows analysis + draft.
5. Agent reviews and updates status.

## Where to go next
- [Backend Architecture](backend.md)
- [Frontend Architecture](frontend.md)
- [AI Pipeline](ai-pipeline.md)
- [API Reference](api-reference.md)
- [Sitemap](sitemap.md)

## Honest project note
The local demo works well. This project still needs production hardening, stronger async processing, and broader automated tests.

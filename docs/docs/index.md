# SamvadAI Documentation

Welcome to the internal documentation for SamvadAI, the advanced Gen-AI powered complaint resolution and analytics platform for Union Bank.

## Project Overview
This repository contains the complete source code for:
- **`apps/api`**: Django + Ninja + LangGraph API backend.
- **`apps/web`**: Vite + React + shadcn/ui frontend dashboard.
- **`shared`**: Cross-platform UI primitives and utilities.

## Getting Started

To run the application locally, you will need `uv` and `npm`.

### 1. Backend Setup
```bash
cd apps/api
uv sync
uv run python manage.py migrate
uv run python manage.py seed_complaints
uv run python manage.py runserver
```

### 2. Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the dashboard!

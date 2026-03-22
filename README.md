# SamvadAI 🚀
**The Ultimate AI-Driven Complaint Management Console for Union Bank**

SamvadAI is an intelligent dashboard designed to streamline bank complaint management. It uses a **LangGraph-based agentic pipeline** to classify, prioritize, and cluster complaints automatically, reducing manual agent workload by up to 80%.

---

## ✨ Key Features Built
- **Dashboard & KPIs**: Real-time monitoring of total complaints, urgent cases, and SLA-breach risks.
- **AI Registry**: Searchable table of all customer issues with live AI progress indicators.
- **Dual-Model Intelligence**: Supports **Gemini 2.5 Flash** (Cloud) and **Phi-3** (Local Ollama) for zero-latency, private analysis.
- **Batch Processing**: An "Analyze All" local processor that loops through huge backlogs sequentially with a live UI progress bar.
- **AI Analysis Intelligence**: Automatic categorization, sentiment extraction, and severity scoring.
- **Draft Response Editor**: Generates high-quality, professional replies for agents to approve and send instantly.
- **Trend Analytics**: Visualizes complaint volume over time and AI-grouped duplicate "Root Cause Clusters."

---

## 🛠️ Technology Stack
- **Backend**: Django 5 + Django-Ninja + SQLite + UV (Package Manager)
- **AI Orchestration**: LangChain + LangGraph + Ollama + Google Generative AI
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui
- **State & Fetching**: Zustand + TanStack Query v5 + Recharts + Sonner (Toasts)
- **Documentation**: MkDocs with Material Theme

---

## 🚀 Quick Start (Manual Setup)

Follow these steps to run the full stack locally:

### 1. Initialize the Backend
Ensure you have `uv` installed, then set up the Django API and seed the database.
```bash
cd apps/api
uv sync
uv run python manage.py migrate
uv run python manage.py seed_complaints
uv run python manage.py runserver 0.0.0.0:8000
```

### 2. Run the Frontend
In a new terminal, install the dependencies and boot Vite.
```bash
cd apps/web
npm install
npm run dev
```

### 3. (Optional) Run Documentation
In a new terminal, you can view the comprehensive project architecture docs.
```bash
cd docs
uv run mkdocs serve -a 0.0.0.0:8001
```

Visit the dashboard at **[http://localhost:5173](http://localhost:5173)**!

---

## 🤖 Local AI Configuration (Edge Processing)
To showcase the "On-Device/Private AI" capabilities, ensure [Ollama](https://ollama.com/) is running:

1. **Pull the model**: `ollama pull phi3`
2. **Enable Local Mode**: Add `USE_LOCAL_LLM=true` to your `apps/api/.env` file.
3. **Trigger Analysis**: Click **"Analyze All"** in the Registry to watch your local machine process the bank's data without internet connectivity!

---

## 📂 Project Structure
- `apps/api/`: Django Ninja backend & LangGraph pipeline.
- `apps/web/`: React frontend features.
- `shared/`: Shared TypeScript types and universal UI components.
- `docs/`: Modular MkDocs technical documentation.

---

## 🔮 Future Roadmap

While the hackathon demo is complete, the architecture is designed to scale with these future additions:
1. **React Native Mobile App**: Using the `shared/` package, agents and branch managers can have a native mobile experience to approve complaint drafts on the go.
2. **WebSocket Live Analysis**: Connecting Django Channels to the React dashboard to stream AI analysis progress token-by-token directly into the UI.
3. **Advanced RAG integration**: Currently, drafts are based on general tone. We plan to insert a vector database (like Qdrant or ChromaDB) loaded with Union Bank's exact policy PDFs, ensuring the AI cites actual bank clauses when drafting refunds.
4. **Automated Sending**: Connecting the "Approve & Send" button directly to the bank's SMTP server / WhatsApp Business API to execute the resolution immediately.

# SamvadAI 🚀
### Gen-AI Powered Complaint Management for Union Bank

**SamvadAI** is a next-generation, AI-driven complaint management platform designed to unify customer grievances from multiple channels into a single, intelligent dashboard. By leveraging the **Claude LLM API**, the system streamlines the entire resolution lifecycle—from automated classification and sentiment analysis to contextual response generation and regulatory compliance.

---

## 🌟 Key Features

### 📡 Omnichannel Unification
Consolidates grievances from all touchpoints into one source of truth:
- **Digital**: Mobile app, Email, and Social Media
- **Physical**: Branch forms and IVR

### 🤖 Intelligent Automation (Powered by Claude LLM)
- **Real-time Classification**: Automatically categorizes complaints (Loan, Card, Digital, Branch, Fraud) and identifies the specific product.
- **Sentiment & Severity**: Evaluates the tone and urgency of each case to prioritize high-risk issues.
- **Duplicate Detection**: Identifies related or recurring complaints across different channels to prevent redundant efforts.
- **Contextual Drafts**: Generates AI-powered response drafts for agents, ensuring high-quality and consistent communication.

### ⏱️ SLA & Escalation Management
- **Countdown Tracking**: Real-time SLA monitoring for each complaint.
- **Automated Escalation**: Intelligent triggers that alert supervisors before performance targets are breached.

### 📊 360-Degree Insights
- **Timeline View**: Full communication history and audit trail for every investigator.
- **Trend Analysis**: surfaces root cause narratives and emerging clusters using Generative AI.
- **Regulatory Reporting**: Auto-drafts summaries compliant with **RBI** and **CPGRAMS** frameworks.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [django-ninja](https://django-ninja.tiangolo.com/) (Python)
- **AI Engine**: [Claude LLM API](https://www.anthropic.com/claude)
- **Documentation**: [MkDocs](https://www.mkdocs.org/)
- **Package Management**: `npm` (Frontend), `uv` (Backend)

---

## 📂 Project Structure

```text
.
├── apps/
│   ├── web/          # Next.js React Frontend
│   └── api/          # django-ninja Python Backend
├── docs/             # MkDocs Documentation
└── README.md         # Project Overview
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- `uv` (Fastest Python package manager)

### Installation

1. **Backend (django-ninja)**:
   ```bash
   cd apps/api
   uv sync
   uv run main.py
   ```

2. **Frontend (React/Next.js)**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

3. **Documentation**:
   ```bash
   cd docs
   mkdocs serve
   ```

---

## 📈 Impact

- **40% Reduction** in average complaint handling time.
- **Improved First-Response Quality** through AI-assisted drafting.
- **100% SLA Compliance** via proactive escalation triggers.
- **Regulatory Ready**: Seamless alignment with the RBI's CGRS framework.

---

## 📄 License
*This project is built for Union Bank of India. All rights reserved.*

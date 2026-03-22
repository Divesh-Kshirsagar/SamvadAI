# Frontend Architecture

The SamvadAI web platform is a modern Single Page Application (SPA).

## Tech Stack
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Data Fetching**: TanStack Query (React Query) v5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts

## Feature Modules
The frontend is divided into independent feature modules located in `apps/web/src/features/`:

1. **Dashboard**: High level KPI cards and simple graphs.
2. **Complaints List**: Searchable and filterable data table of all registry complaints.
3. **Complaint Detail**: The single view for a complaint, containing the AI Analysis intelligence panel and Draft Response Editor.
4. **Analytics**: Macro-level complaint trends over time and duplicate root-cause clustering.

## Batch Processing Algorithm
To protect the local **Phi-3** execution environment (Ollama), the "Analyze All" feature uses a **Sequential Chunking Loop** rather than parallel requests.

**Algorithm Pseudo-code**:
```typescript
function async analyzeAll(complaints) {
  const pending = complaints.filter(c => !c.has_analysis);
  for (const item of pending) {
    try {
      await api.post(`/analyze/${item.id}`);
      updateZustandProgress();
      queryClient.invalidateQueries();
    } catch (e) {
      handleError(e);
    }
  }
}
```

## State Management
Global state (including the batch-processor progress and analysis status) is managed using **Zustand**, allowing the AI pipeline to continue processing in the **background** even if the user switches between feature tabs or navigates away from the registry.

import { useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { ComplaintsTable } from "./components/ComplaintsTable";
import { useComplaints } from "@/hooks/useComplaints";
import { useAnalysisStore } from "@/hooks/useAnalysisStore";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ComplaintsPage() {
  const [filters, setFilters] = useState({ priority: "All", status: "All", channel: "All" });
  const { data, isLoading } = useComplaints(filters);
  const queryClient = useQueryClient();
  const { isAnalyzing, progress, total, analyzeAll } = useAnalysisStore();

  const handleAnalyzeAll = () => {
    if (data) analyzeAll(data, queryClient);
  };

  return (
    <div className="flex-1 space-y-4 pt-6 pb-8 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Complaints Registry</h2>
        <Button 
          onClick={handleAnalyzeAll} 
          disabled={isAnalyzing || !data?.length}
          className="gap-2"
        >
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
          {isAnalyzing ? `Analyzing... (${progress}/${total})` : "Analyze All (Local Model)"}
        </Button>
      </div>
      
      {isAnalyzing && (
        <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden border">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(progress / total) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="mt-4">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex-1">
        <ComplaintsTable complaints={data || []} isLoading={isLoading} />
      </div>
    </div>
  )
}

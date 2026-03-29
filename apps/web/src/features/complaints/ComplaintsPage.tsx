import { useState, useMemo } from "react";
import { ComplaintsFilterBar } from "./components/FilterBar";
import { ComplaintsTable } from "./components/ComplaintsTable";
import { useComplaints } from "@/hooks/useComplaints";
import { useAnalysisStore } from "@/hooks/useAnalysisStore";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useDebounce } from "@/hooks/useDebounce";

export default function ComplaintsPage() {
  const { data, isLoading, isError, refetch } = useComplaints({ priority: "All", status: "All", channel: "All" });
  const queryClient = useQueryClient();
  const { isAnalyzing, progress, total, analyzeAll } = useAnalysisStore();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["ALL"]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["ALL"]);

  const handleAnalyzeAll = () => {
    if (data) analyzeAll(data, queryClient);
  };

  const handlePriorityChange = (val: string[]) => {
    if (val.length === 0) return setSelectedPriorities(["ALL"]);
    if (val[val.length - 1] === "ALL" && !selectedPriorities.includes("ALL")) return setSelectedPriorities(["ALL"]);
    if (val.includes("ALL") && val.length > 1) return setSelectedPriorities(val.filter(v => v !== "ALL"));
    setSelectedPriorities(val);
  }

  const handleStatusChange = (val: string[]) => {
    if (val.length === 0) return setSelectedStatuses(["ALL"]);
    if (val[val.length - 1] === "ALL" && !selectedStatuses.includes("ALL")) return setSelectedStatuses(["ALL"]);
    if (val.includes("ALL") && val.length > 1) return setSelectedStatuses(val.filter(v => v !== "ALL"));
    setSelectedStatuses(val);
  }

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedPriorities(["ALL"]);
    setSelectedStatuses(["ALL"]);
  }

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(complaint => {
      // Priority filter (map Urgent -> CRITICAL)
      const cPriority = complaint.actual_priority.toUpperCase() === "URGENT" ? "CRITICAL" : complaint.actual_priority.toUpperCase();
      const matchesPriority = selectedPriorities.includes("ALL") || selectedPriorities.includes(cPriority);

      // Status filter (map "In Progress" -> "IN_PROGRESS")
      const cStatus = complaint.status.toUpperCase().replace(" ", "_");
      const matchesStatus = selectedStatuses.includes("ALL") || selectedStatuses.includes(cStatus);

      // Search filter
      const searchLower = debouncedSearch.toLowerCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawText = (complaint as any).raw_text || "";
      const matchesSearch = !debouncedSearch || 
        complaint.customer_name.toLowerCase().includes(searchLower) ||
        rawText.toLowerCase().includes(searchLower) ||
        complaint.id.toLowerCase().includes(searchLower) ||
        complaint.channel.toLowerCase().includes(searchLower);

      return matchesPriority && matchesStatus && matchesSearch;
    });
  }, [data, selectedPriorities, selectedStatuses, debouncedSearch]);

  const hasActiveFilters = selectedPriorities[0] !== "ALL" || selectedStatuses[0] !== "ALL" || debouncedSearch.length > 0;

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
        <ComplaintsFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPriorities={selectedPriorities}
          setSelectedPriorities={handlePriorityChange}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={handleStatusChange}
        />

        {hasActiveFilters && data && (
          <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
            <span>Showing <strong className="text-foreground">{filteredData.length}</strong> of <strong className="text-foreground">{data.length}</strong> complaints</span>
            <span className="text-border">•</span>
            <button 
              onClick={handleClearAll}
              className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded px-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="flex-1">
        {isError && (
          <div className="mb-4">
            <ErrorBanner onRetry={() => refetch()} />
          </div>
        )}
        <ComplaintsTable 
          complaints={filteredData} 
          isLoading={isLoading} 
          onClearFilters={hasActiveFilters ? handleClearAll : undefined} 
        />
      </div>
    </div>
  )
}

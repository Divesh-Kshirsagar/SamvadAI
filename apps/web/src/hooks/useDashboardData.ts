import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export interface SummaryData {
  total: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  open_count: number;
  in_progress: number;
  resolved: number;
  by_category: Record<string, number>;
  by_channel: Record<string, number>;
  by_priority: Record<string, number>;
}

export function useDashboardSummary() {
  const query = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => fetcher<SummaryData>("/complaints/analytics/summary/"),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error("Failed to load dashboard stats", { description: query.error.message, duration: 5000 });
    }
  }, [query.isError, query.error]);

  return query;
}

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";

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
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => fetcher<SummaryData>("/analytics/summary/"),
  });
}

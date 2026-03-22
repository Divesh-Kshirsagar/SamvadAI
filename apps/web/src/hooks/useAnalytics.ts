import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";

export interface TrendPoint {
  date: string;
  count: number;
}

export interface Cluster {
  cluster_tag: string;
  root_cause_summary: string | null;
  complaint_count: number;
}

export function useTrends() {
  return useQuery({
    queryKey: ["analytics", "trends"],
    queryFn: () => fetcher<TrendPoint[]>("/analytics/trends/"),
  });
}

export function useClusters() {
  return useQuery({
    queryKey: ["analytics", "clusters"],
    queryFn: () => fetcher<Cluster[]>("/analytics/clusters/"),
  });
}

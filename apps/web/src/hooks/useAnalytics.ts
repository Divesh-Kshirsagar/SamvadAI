import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

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
  const query = useQuery({
    queryKey: ["analytics", "trends"],
    queryFn: () => fetcher<TrendPoint[]>("/complaints/analytics/trends/"),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error("Failed to load analytics trends", { description: query.error.message, duration: 5000 });
    }
  }, [query.isError, query.error]);

  return query;
}

export function useClusters() {
  const query = useQuery({
    queryKey: ["analytics", "clusters"],
    queryFn: () => fetcher<Cluster[]>("/complaints/analytics/clusters/"),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error("Failed to load analytics clusters", { description: query.error.message, duration: 5000 });
    }
  }, [query.isError, query.error]);

  return query;
}

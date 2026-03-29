import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export interface Complaint {
  id: string;
  customer_name: string;
  timestamp: string;
  channel: string;
  account_type: string;
  actual_priority: string;
  status: string;
  has_analysis: boolean;
}

export function useComplaints(filters: { priority?: string; status?: string; channel?: string }) {
  const query = useQuery({
    queryKey: ["complaints", "list", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.priority && filters.priority !== "All") params.append("priority", filters.priority);
      if (filters.status && filters.status !== "All") params.append("status", filters.status);
      if (filters.channel && filters.channel !== "All") params.append("channel", filters.channel);
      
      const qs = params.toString();
      return fetcher<Complaint[]>(`/complaints/${qs ? `?${qs}` : ""}`);
    },
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error("Failed to load complaints", { description: query.error.message, duration: 5000 });
    }
  }, [query.isError, query.error]);

  return query;
}

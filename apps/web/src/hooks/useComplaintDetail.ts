import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Complaint } from "@/hooks/useComplaints";

export interface AnalysisResult {
  category: string;
  product: string;
  sentiment: string;
  ai_priority: string;
  sla_hours: number;
  ai_draft: string;
  cluster_tag: string | null;
  duplicate_of: string | null;
  analyzed_at: string;
}

export interface ComplaintDetail extends Complaint {
  analysis: AnalysisResult | null;
}

export function useComplaintDetail(id: string) {
  const query = useQuery({
    queryKey: ["complaint", id],
    queryFn: () => fetcher<ComplaintDetail>(`/complaints/${id}/`),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error("Failed to load complaint details", { description: query.error.message, duration: 5000 });
    }
  }, [query.isError, query.error]);

  return query;
}

export function useAnalyzeComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetcher<{ status: string; analysis: AnalysisResult }>(`/complaints/${id}/analyze/`, { method: "POST" }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["complaint", id] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (error) => {
      toast.error("Failed to analyze complaint", { description: error.message, duration: 5000 });
    }
  });
}

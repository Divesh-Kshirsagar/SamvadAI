import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
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
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: () => fetcher<ComplaintDetail>(`/complaints/${id}/`),
    enabled: !!id,
  });
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
  });
}

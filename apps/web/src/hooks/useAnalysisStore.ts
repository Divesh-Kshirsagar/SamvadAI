import { create } from 'zustand';
import { fetcher } from '@/lib/api';
import type { Complaint } from './useComplaints';
import { toast } from 'sonner';

interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  total: number;
  analyzeAll: (data: Complaint[], queryClient: import('@tanstack/react-query').QueryClient) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  isAnalyzing: false,
  progress: 0,
  total: 0,
  analyzeAll: async (data, queryClient) => {
    if (get().isAnalyzing) return;
    
    // Filter out already analyzed complaints
    const toAnalyze = data.filter(c => !c.has_analysis);
    if (toAnalyze.length === 0) {
      toast.info("All selected complaints are already analyzed!");
      return;
    }
    
    set({ isAnalyzing: true, total: toAnalyze.length, progress: 0 });
    
    let successCount = 0;
    for (const complaint of toAnalyze) {
      try {
        await fetcher(`/complaints/${complaint.id}/analyze/`, { method: "POST" });
        successCount++;
        set({ progress: successCount });
        // Invalidate queries so the table & dashboard update live
        queryClient.invalidateQueries({ queryKey: ["complaints"] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
      } catch (error) {
        console.error("Failed to analyze", complaint.id, error);
        toast.error(`Failed to analyze complaint from ${complaint.customer_name}`);
      }
    }
    
    set({ isAnalyzing: false });
    toast.success(`Analysis Complete`, { description: `Successfully ran AI on ${successCount} complaints.`});
  }
}));

export interface Complaint {
  id: string;
  customer_name: string;
  timestamp: string;
  channel: string;
  account_type: string;
  actual_priority: string;
  status: string;
}

export interface AnalysisResult {
  category: string;
  product: string;
  sentiment: string;
  priority: string;
  sla_hours: number;
  ai_draft: string;
  cluster_tag: string | null;
  duplicate_of: string | null;
  analyzed_at: string;
}

export interface ComplaintDetail extends Complaint {
  analysis: AnalysisResult | null;
}

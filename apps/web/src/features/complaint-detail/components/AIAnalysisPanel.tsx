import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AnalysisResult } from "@/hooks/useComplaintDetail";

export function AIAnalysisPanel({ analysis }: { analysis: AnalysisResult }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "default";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "default";
    }
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "Hostile" || sentiment === "Negative") return "destructive";
    if (sentiment === "Positive") return "default"; // green would be better
    return "secondary";
  }

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>AI Analysis Intelligence</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
            Gemini Gen-AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p className="font-medium">{analysis.category}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Product</p>
            <p className="font-medium">{analysis.product}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Sentiment</p>
            <Badge variant={getSentimentColor(analysis.sentiment) as any}>{analysis.sentiment}</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Severity</p>
            <Badge variant={getPriorityColor(analysis.priority) as any}>{analysis.priority}</Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Estimated SLA Focus</p>
            <p className="font-medium">{analysis.sla_hours} hours deadline focus</p>
          </div>
          {analysis.cluster_tag && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Root Cause Cluster</p>
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                {analysis.cluster_tag}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

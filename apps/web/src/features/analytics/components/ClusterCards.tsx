import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useClusters } from "@/hooks/useAnalytics";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export function ClusterCards() {
  const { data, isLoading } = useClusters();

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-muted rounded-xl" /><div className="h-32 bg-muted rounded-xl" /></div>;

  return (
    <div className="space-y-4">
      {data?.map((cluster) => (
        <Card key={cluster.cluster_tag} className="bg-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                {cluster.cluster_tag}
              </CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {cluster.complaint_count} Cases
              </Badge>
            </div>
            <CardDescription>AI-identified root cause narrative</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {cluster.root_cause_summary || "Gathering more data for root cause synthesis..."}
            </p>
          </CardContent>
        </Card>
      ))}
      {data?.length === 0 && (
        <Card className="border-dashed flex items-center justify-center min-h-[150px] text-muted-foreground">
          No clusters generated yet.
        </Card>
      )}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardData";
import { AlertCircle, Clock, FileText, Activity } from "lucide-react";

export function KpiCards() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse"><div className="h-32 bg-muted rounded-xl bg-muted/60" /><div className="h-32 bg-muted rounded-xl bg-muted/60" /><div className="h-32 bg-muted rounded-xl bg-muted/60" /><div className="h-32 bg-muted rounded-xl bg-muted/60" /></div>;
  if (error) return <div>Failed to load data</div>;
  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">Urgent Cases</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{data.urgent}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.open_count}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SLA Risk (Mock)</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{Math.floor(data.total * 0.1)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

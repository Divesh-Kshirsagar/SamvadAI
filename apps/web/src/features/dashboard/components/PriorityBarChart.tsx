import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ErrorBanner } from "@/components/ErrorBanner";

interface PriorityBarChartProps {
  onSegmentClick?: (key: string, value: string) => void;
}

const CustomTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-card rounded-lg shadow-md p-3 text-sm border">
        <p className="font-semibold mb-1">{data.name}</p>
        <p className="text-muted-foreground">{value} complaints</p>
        <p className="text-muted-foreground">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

export function PriorityBarChart({ onSegmentClick }: PriorityBarChartProps) {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  const chartData = data ? Object.entries(data.by_priority)
    .map(([name, value]) => ({
        name,
        value,
    }))
    .sort((a,b) => Number(b.value) - Number(a.value)) : [];

  const total = chartData.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[300px] flex items-center justify-center max-w-sm mx-auto">
            <ErrorBanner onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip total={total} />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    className={onSegmentClick ? "cursor-pointer transition-opacity hover:opacity-80" : ""}
                    onClick={() => onSegmentClick?.("actual_priority", entry.name)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  )
}

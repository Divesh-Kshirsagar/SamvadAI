import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTrends } from "@/hooks/useAnalytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function TrendLineChart() {
  const { data, isLoading } = useTrends();

  if (isLoading) return <Card className="h-[400px] animate-pulse bg-muted/60"><CardContent /></Card>;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Complaint Volume Trends</CardTitle>
        <CardDescription>Daily volume of incoming complaints over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value} complaints`, "Volume"]}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

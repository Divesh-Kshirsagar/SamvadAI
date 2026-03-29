import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTrends } from "@/hooks/useAnalytics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ErrorBanner } from "@/components/ErrorBanner";

export function TrendLineChart() {
  const { data, isLoading, isError, refetch } = useTrends();

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Complaint Volume Trends</CardTitle>
        <CardDescription>Daily volume of incoming complaints over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[350px] mt-4 flex items-center justify-center max-w-sm mx-auto">
            <ErrorBanner onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="h-[350px] mt-4 flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}

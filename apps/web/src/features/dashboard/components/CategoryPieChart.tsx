import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BrainCircuit } from "lucide-react";
import { ErrorBanner } from "@/components/ErrorBanner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface CategoryPieChartProps {
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

export function CategoryPieChart({ onSegmentClick }: CategoryPieChartProps) {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  const chartData = data ? Object.entries(data.by_category).map(([name, value]) => ({
    name,
    value,
  })) : [];
  const total = chartData.reduce((sum, item) => sum + Number(item.value), 0);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Complaints by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[300px] flex items-center justify-center max-w-sm mx-auto">
            <ErrorBanner onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className={onSegmentClick ? "cursor-pointer transition-opacity hover:opacity-80" : ""}
                      onClick={() => onSegmentClick?.("category", entry.name)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip total={total} />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-md border border-dashed">
            <BrainCircuit className="h-10 w-10 mb-4 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No Categories Assigned</p>
            <p className="text-sm text-center px-8 mt-1">
              Categories are dynamically assigned by the Gemini AI. Trigger AI Analysis on a complaint to see the breakdown here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


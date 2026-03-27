import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardSummary } from "@/hooks/useDashboardData";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BrainCircuit } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function CategoryPieChart() {
  const { data } = useDashboardSummary();

  if (!data) return null;

  const chartData = Object.entries(data.by_category).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Complaints by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
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
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} complaints`, "Count"]} />
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


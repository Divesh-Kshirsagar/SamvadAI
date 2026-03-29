import { useState } from "react";
import { KpiCards } from "./components/KpiCards";
import { CategoryPieChart } from "./components/CategoryPieChart";
import { PriorityBarChart } from "./components/PriorityBarChart";
import { RecentComplaintsTable } from "./components/RecentComplaintsTable";
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

export default function DashboardPage() {
  const [filter, setFilter] = useState<{ key: string, value: string } | null>(null);

  const handleSegmentClick = (key: string, value: string) => {
    setFilter({ key, value });
  };

  const clearFilter = () => setFilter(null);

  return (
    <div className="flex-1 space-y-4 pt-6 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {filter && (
          <Button variant="outline" size="sm" onClick={clearFilter} className="h-8 border-dashed">
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filter: {filter.value}
          </Button>
        )}
      </div>
      <KpiCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryPieChart onSegmentClick={handleSegmentClick} />
        <PriorityBarChart onSegmentClick={handleSegmentClick} />
      </div>
      <div className="grid gap-4 grid-cols-1">
        <RecentComplaintsTable filterParams={filter} />
      </div>
    </div>
  )
}

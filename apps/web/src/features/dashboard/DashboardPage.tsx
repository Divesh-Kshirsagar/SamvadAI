import { KpiCards } from "./components/KpiCards";
import { CategoryPieChart } from "./components/CategoryPieChart";
import { PriorityBarChart } from "./components/PriorityBarChart";
import { RecentComplaintsTable } from "./components/RecentComplaintsTable";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 pt-6 pb-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <KpiCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryPieChart />
        <PriorityBarChart />
      </div>
      <div className="grid gap-4 grid-cols-1">
        <RecentComplaintsTable />
      </div>
    </div>
  )
}

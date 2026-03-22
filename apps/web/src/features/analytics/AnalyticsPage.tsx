import { TrendLineChart } from "./components/TrendLineChart";
import { ClusterCards } from "./components/ClusterCards";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 pt-6 pb-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligence & Analytics</h2>
          <p className="text-muted-foreground mt-1">Macro trends and AI synthesized root cause clusters</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TrendLineChart />
        </div>
        
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Root Cause Clusters</h3>
          <p className="text-sm text-muted-foreground mb-4">
            AI automatically groups similar complaints to identify systemic issues.
          </p>
          <ClusterCards />
        </div>
      </div>
    </div>
  )
}

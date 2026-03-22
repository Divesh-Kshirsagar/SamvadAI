import { useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { ComplaintsTable } from "./components/ComplaintsTable";
import { useComplaints } from "@/hooks/useComplaints";

export default function ComplaintsPage() {
  const [filters, setFilters] = useState({ priority: "All", status: "All", channel: "All" });
  const { data, isLoading } = useComplaints(filters);

  return (
    <div className="flex-1 space-y-4 pt-6 pb-8 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Complaints Registry</h2>
      </div>
      
      <div className="mt-4">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="flex-1">
        <ComplaintsTable complaints={data || []} isLoading={isLoading} />
      </div>
    </div>
  )
}

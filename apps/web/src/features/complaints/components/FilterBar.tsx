import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/statusColors";
import type { Priority, Status } from "@/lib/statusColors";
import { cn } from "@/lib/utils";

interface ComplaintsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPriorities: string[];
  setSelectedPriorities: (val: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (val: string[]) => void;
}

export function ComplaintsFilterBar({
  searchQuery,
  setSearchQuery,
  selectedPriorities,
  setSelectedPriorities,
  selectedStatuses,
  setSelectedStatuses
}: ComplaintsFilterBarProps) {
  
  const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const statuses: Status[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
        
        {/* Chips Group */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Priority</span>
            <ToggleGroup 
              type="multiple" 
              value={selectedPriorities} 
              onValueChange={setSelectedPriorities} 
              className="justify-start flex-wrap gap-2"
            >
              <ToggleGroupItem value="ALL" className={cn("h-7 px-3 text-xs rounded-full border", selectedPriorities.includes("ALL") ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground")}>All</ToggleGroupItem>
              {priorities.map(p => {
                const config = PRIORITY_CONFIG[p];
                const isActive = selectedPriorities.includes(p);
                return (
                  <ToggleGroupItem 
                    key={p} 
                    value={p} 
                    className={cn(
                      "h-7 px-3 flex items-center gap-1.5 text-xs rounded-full border transition-colors",
                      isActive ? config.badgeClass : "text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {isActive && <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />}
                    {config.label}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border mt-5" />

          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">Status</span>
            <ToggleGroup 
              type="multiple" 
              value={selectedStatuses} 
              onValueChange={setSelectedStatuses}
              className="justify-start flex-wrap gap-2"
            >
              <ToggleGroupItem value="ALL" className={cn("h-7 px-3 text-xs rounded-full border", selectedStatuses.includes("ALL") ? "bg-secondary text-secondary-foreground font-medium" : "text-muted-foreground")}>All</ToggleGroupItem>
              {statuses.map(s => {
                const config = STATUS_CONFIG[s];
                const isActive = selectedStatuses.includes(s);
                return (
                  <ToggleGroupItem 
                    key={s} 
                    value={s} 
                    className={cn(
                      "h-7 px-3 flex items-center gap-1.5 text-xs rounded-full border transition-colors",
                      isActive ? config.badgeClass : "text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {isActive && <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />}
                    {config.label}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-[350px] relative mt-2 lg:mt-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by customer name or complaint text..." 
            className="pl-9 bg-background h-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

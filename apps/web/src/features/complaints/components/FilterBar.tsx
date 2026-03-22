import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  filters: { priority: string; status: string; channel: string };
  setFilters: (filters: { priority: string; status: string; channel: string }) => void;
}

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-[200px]">
        <Select 
          value={filters.priority} 
          onValueChange={(val: string) => setFilters({ ...filters, priority: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Priorities</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[200px]">
        <Select 
          value={filters.status} 
          onValueChange={(val: string) => setFilters({ ...filters, status: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[200px]">
        <Select 
          value={filters.channel} 
          onValueChange={(val: string) => setFilters({ ...filters, channel: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Channels</SelectItem>
            <SelectItem value="Mobile App">Mobile App</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="IVR">IVR</SelectItem>
            <SelectItem value="In-Branch">In-Branch</SelectItem>
            <SelectItem value="Social Media">Social Media</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={() => setFilters({ priority: "All", status: "All", channel: "All" })}>
        Reset Filters
      </Button>
    </div>
  )
}

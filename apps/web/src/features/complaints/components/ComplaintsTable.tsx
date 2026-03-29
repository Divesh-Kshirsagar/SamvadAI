import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Complaint } from "@/hooks/useComplaints";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ComplaintsTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  onClearFilters?: () => void;
}

export function ComplaintsTable({ complaints, isLoading, onClearFilters }: ComplaintsTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "default";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "default";
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-48">Customer</TableHead>
            <TableHead className="w-28">Channel</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead className="w-28">Priority</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-24 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex flex-col gap-2 py-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end"><Skeleton className="h-8 w-20" /></div>
                </TableCell>
              </TableRow>
            ))
          ) : complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-72 text-center align-middle">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Inbox className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground">No complaints match your filters</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                  </div>
                  {onClearFilters && (
                    <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-2 text-sm max-w-fit mx-auto cursor-pointer flex">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="w-48 font-medium max-h-14 overflow-hidden truncate max-w-[12rem]" title={complaint.customer_name}>
                  {complaint.customer_name}
                  <div className="text-xs text-muted-foreground mt-1 truncate" title={new Date(complaint.timestamp).toLocaleString()}>
                    {new Date(complaint.timestamp).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="w-28 max-h-14 overflow-hidden truncate" title={complaint.channel}>
                  {complaint.channel}
                </TableCell>
                <TableCell className="max-h-14 overflow-hidden truncate" title={complaint.account_type}>
                  {complaint.account_type}
                </TableCell>
                <TableCell className="w-28 max-h-14 overflow-hidden">
                  <Badge variant={getPriorityColor(complaint.actual_priority) as "default" | "secondary" | "destructive" | "outline"} className="truncate" title={complaint.actual_priority}>
                    {complaint.actual_priority}
                  </Badge>
                </TableCell>
                <TableCell className="w-32 max-h-14 overflow-hidden truncate" title={complaint.status}>
                  <Badge variant={complaint.status === "Open" ? "secondary" : "default"} className="truncate">
                    {complaint.status}
                  </Badge>
                </TableCell>
                <TableCell className="w-24 text-right align-middle max-h-14 overflow-hidden">
                  <Button variant="ghost" size="sm" asChild className="ml-auto flex shrink-0">
                    <Link to={`/complaints/${complaint.id}`}>
                      View <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

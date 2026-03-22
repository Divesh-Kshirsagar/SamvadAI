import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Complaint } from "@/hooks/useComplaints";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ComplaintsTableProps {
  complaints: Complaint[];
  isLoading: boolean;
}

export function ComplaintsTable({ complaints, isLoading }: ComplaintsTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "default";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "default";
    }
  }

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground bg-card rounded-xl border animate-pulse">Loading complaints...</div>;
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Account Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No complaints match your filters.
              </TableCell>
            </TableRow>
          ) : (
            complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">
                  {complaint.customer_name}
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(complaint.timestamp).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{complaint.channel}</TableCell>
                <TableCell>{complaint.account_type}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(complaint.actual_priority) as "default" | "secondary" | "destructive" | "outline"}>
                    {complaint.actual_priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={complaint.status === "Open" ? "secondary" : "default"}>
                    {complaint.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
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

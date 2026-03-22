import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Complaint {
  id: string;
  customer_name: string;
  timestamp: string;
  channel: string;
  account_type: string;
  actual_priority: "Urgent" | "High" | "Medium" | "Low";
  status: string;
}

export function RecentComplaintsTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["complaints", "recent"],
    // In a real app we'd paginate/filter, here we just fetch all and slice
    queryFn: () => fetcher<Complaint[]>("/complaints/"),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "destructive";
      case "High": return "default"; // or an orange variant if set up
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "default";
    }
  }

  return (
    <Card className="col-span-4 lg:col-span-7">
      <CardHeader>
        <CardTitle>Recent Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.slice(0, 5).map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">{complaint.customer_name}</TableCell>
                  <TableCell>{complaint.channel}</TableCell>
                  <TableCell>{complaint.account_type}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(complaint.actual_priority) as "default" | "secondary" | "destructive" | "outline"}>
                      {complaint.actual_priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{complaint.status}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(complaint.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No complaints found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBanner } from "@/components/ErrorBanner";

interface Complaint {
  id: string;
  customer_name: string;
  timestamp: string;
  channel: string;
  account_type: string;
  actual_priority: "Urgent" | "High" | "Medium" | "Low";
  status: string;
}

interface RecentComplaintsTableProps {
  filterParams?: { key: string; value: string } | null;
}

export function RecentComplaintsTable({ filterParams }: RecentComplaintsTableProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["complaints", "recent"],
    // In a real app we'd paginate/filter, here we just fetch all and slice
    queryFn: () => fetcher<Complaint[]>("/complaints/"),
  });

  const filteredData = data?.filter((item: any) => {
    if (!filterParams) return true;
    if (filterParams.key === "category") {
       return item.category === filterParams.value || item.predicted_category === filterParams.value;
    }
    return item[filterParams.key] === filterParams.value;
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
        <CardTitle className="text-lg font-semibold">Recent Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="h-[300px] flex items-center justify-center max-w-sm mx-auto">
            <ErrorBanner onRetry={() => refetch()} />
          </div>
        ) : isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Customer</TableHead>
                <TableHead className="w-28">Channel</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="w-28">Priority</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-36 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData?.slice(0, 5).map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="w-48 font-medium max-h-14 overflow-hidden truncate max-w-[12rem]" title={complaint.customer_name}>
                    {complaint.customer_name}
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
                    {complaint.status}
                  </TableCell>
                  <TableCell className="w-36 text-right text-muted-foreground max-h-14 overflow-hidden truncate" title={new Date(complaint.timestamp).toLocaleDateString()}>
                    {new Date(complaint.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No complaints found matching this filter.
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

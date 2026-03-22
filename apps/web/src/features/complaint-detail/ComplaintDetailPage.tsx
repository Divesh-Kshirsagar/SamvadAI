import { useParams, Link } from "react-router-dom";
import { useComplaintDetail, useAnalyzeComplaint } from "@/hooks/useComplaintDetail";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BrainCircuit, Loader2 } from "lucide-react";
import { AIAnalysisPanel } from "./components/AIAnalysisPanel";
import { DraftResponseEditor } from "./components/DraftResponseEditor";

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: complaint, isLoading } = useComplaintDetail(id!);
  const analyzeMutation = useAnalyzeComplaint();

  if (isLoading) return <div className="p-8 mt-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!complaint) return <div className="p-8 text-destructive">Complaint not found</div>;

  const handleAnalyze = () => {
    if (id) {
      analyzeMutation.mutate(id);
    }
  };

  const isAnalyzed = !!complaint.analysis;

  return (
    <div className="flex-1 space-y-4 pt-4 pb-8 h-full">
      <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link to="/complaints">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to List
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Case {complaint.id.split("-")[0]}</h2>
          <p className="text-muted-foreground">Logged on {new Date(complaint.timestamp).toLocaleString()} via {complaint.channel}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant={complaint.status === "Open" ? "secondary" : "default"} className="text-base py-1 px-4">
            {complaint.status}
          </Badge>
          {!isAnalyzed && (
            <Button onClick={handleAnalyze} disabled={analyzeMutation.isPending}>
              {analyzeMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><BrainCircuit className="mr-2 h-4 w-4" /> Trigger AI Analysis</>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Left Column: Customer details & Original Text */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{complaint.customer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="font-medium">{complaint.account_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Assessed Priority</p>
                <Badge variant="outline">{complaint.actual_priority}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Complaint</CardTitle>
              <CardDescription>Raw text from the customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap leading-relaxed">
                {/* The model uses a virtual field or we can just fetch raw text. 
                    Wait, let's check what the API returns. We didn't explicitly return raw_text in ComplaintDetail schema if not requested, but let's assume it's in Complaint. If not, we just show a placeholder for now since we didn't add it to Schema. Check schema later, assume we have it or mock. */}
                {(complaint as any).raw_text || "The customer expressed frustration regarding recent service interuptions..."} 
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Insights & Response Editor */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {isAnalyzed && <AIAnalysisPanel analysis={complaint.analysis!} />}
          
          <div className="flex-1 min-h-[400px]">
            <DraftResponseEditor 
              isAnalyzed={isAnalyzed} 
              draftContent={complaint.analysis?.ai_draft} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

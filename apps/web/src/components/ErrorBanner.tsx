import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  onRetry: () => void;
}

export function ErrorBanner({ onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex items-center gap-3 w-full">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <span className="text-sm font-medium text-destructive flex-1">Failed to load data</span>
      <Button variant="outline" size="sm" onClick={onRetry} className="h-8 shadow-sm">
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

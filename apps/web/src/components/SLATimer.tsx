import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SLATimerProps {
  slaDeadline: string; // ISO datetime string
  status: string;
  totalSlaHours?: number; // Required to calculate the >50%, 10-50% percentages (defaulting to 48 hours)
}

export default function SLATimer({ slaDeadline, status, totalSlaHours = 48 }: SLATimerProps) {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (status === "RESOLVED" || status === "CLOSED") {
      return;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  if (status === "RESOLVED" || status === "CLOSED") {
    return (
      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 gap-1.5 w-fit font-medium">
        <Clock className="w-3.5 h-3.5" />
        Resolved
      </Badge>
    );
  }

  const deadline = new Date(slaDeadline).getTime();
  const diff = deadline - now;
  const isOverdue = diff < 0;
  
  // Calculate absolute time difference for formatting
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  const timeString = `${hours}h ${minutes}m`;

  // Calculate percentage of time left to determine the color
  const totalMs = totalSlaHours * 60 * 60 * 1000;
  const percentageLeft = isOverdue ? 0 : (diff / totalMs) * 100;

  // Determine colors based on thresholds provided
  let colorClass = "";
  if (isOverdue || percentageLeft < 10) {
    colorClass = "bg-red-100 text-red-800 border-red-200 shadow-sm"; // Red (Overdue or < 10%)
  } else if (percentageLeft <= 50) {
    colorClass = "bg-amber-100 text-amber-800 border-amber-200 shadow-sm"; // Amber (10% - 50%)
  } else {
    colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm"; // Green (> 50%)
  }

  return (
    <Badge variant="outline" className={cn("gap-1.5 w-fit font-medium", colorClass)}>
      <Clock className="w-3.5 h-3.5" />
      {isOverdue ? `OVERDUE ${timeString}` : `${timeString} remaining`}
    </Badge>
  );
}

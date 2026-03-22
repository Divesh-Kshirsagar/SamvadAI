export function calculateSLARemaining(timestamp: string, slaHours: number): { remainingHours: number; isBreached: boolean } {
  const created = new Date(timestamp).getTime();
  const deadline = created + (slaHours * 60 * 60 * 1000);
  const now = Date.now();
  
  const remainingMs = deadline - now;
  const remainingHours = Number((remainingMs / (1000 * 60 * 60)).toFixed(1));
  
  return {
    remainingHours,
    isBreached: remainingHours < 0
  };
}

export function formatSLA(remainingHours: number): string {
  if (remainingHours < 0) {
    return `Breached by ${Math.abs(remainingHours)}h`;
  }
  return `${remainingHours}h remaining`;
}

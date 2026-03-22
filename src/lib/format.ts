export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function formatViews(count: number): string | null {
  if (count <= 0) return null;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}K`;
  return count.toString();
}

export function formatRuntime(totalSeconds: number): { hours: number; mins: number } {
  return {
    hours: Math.floor(totalSeconds / 3600),
    mins: Math.floor((totalSeconds % 3600) / 60),
  };
}

/**
 * Format detik ke format menit:detik (misal: 150 -> "2m 30s")
 */
export function formatExtractionTime(totalSeconds?: number | null): string {
  if (!totalSeconds || totalSeconds <= 0) return "0s";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

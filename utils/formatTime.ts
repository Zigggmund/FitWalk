export default function formatTime(totalMinutes: number): string {
  const days = Math.floor(totalMinutes / 1440); // 1440 минут в сутках
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} д`);
  if (hours > 0) parts.push(`${hours} ч`);
  if (minutes > 0) parts.push(`${minutes} мин`);

  return parts.length ? parts.join(' ') : '0 мин';
}

export default function calculateDistance(
  points: { latitude: number; longitude: number }[],
): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = (prev.latitude * Math.PI) / 180;
    const φ2 = (curr.latitude * Math.PI) / 180;
    const Δφ = ((curr.latitude - prev.latitude) * Math.PI) / 180;
    const Δλ = ((curr.longitude - prev.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total);
}

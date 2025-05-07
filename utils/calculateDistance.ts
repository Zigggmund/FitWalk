// utils/calculateDistance.ts
import { LatLng } from 'react-native-maps';

export default function calculateDistance(points: LatLng[]): number {
  if (points.length < 2) return 0;

  let totalDistance = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];

    totalDistance += haversineDistance(prev, current);
  }

  return totalDistance;
}

function haversineDistance(coord1: LatLng, coord2: LatLng): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(coord2.latitude - coord1.latitude);
  const dLon = deg2rad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.latitude)) *
    Math.cos(deg2rad(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert to meters

  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
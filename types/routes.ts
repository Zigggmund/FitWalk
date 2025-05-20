export interface Route {
  id?: number;
  title?: string;
  description?: string;
  travelTime?: number;
  length?: number;
}

export interface RoutePoint {
  routeId: number;
  latitude: number;
  longitude: number;
  pointType: 'start' | 'end' | 'path';
  timestamp?: number;
}

export interface RouteWithPoints {
  route: Route;
  points: RoutePoint[];
}

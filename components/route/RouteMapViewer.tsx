import React from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { RoutePoint } from '@/types/routes';

interface RouteMapViewerProps {
  points: RoutePoint[];
  markers?: RoutePoint[];
  showMarkers: boolean;
  showStartEnd: boolean;
  multiRoute?: boolean;
  routeColors?: string[];
}

const RouteMapViewer: React.FC<RouteMapViewerProps> = ({
                                                         points,
                                                         markers = [],
                                                         showMarkers,
                                                         showStartEnd,
                                                         multiRoute = false,
                                                         routeColors = ['#0000FF'],
                                                       }) => {
  if (!points || points.length === 0) return null;

  // Группировка точек по маршрутам (если multiRoute=true)
  const routeGroups = multiRoute
    ? groupPointsByRoute(points)
    : [{ points, color: routeColors[0] }];

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={calculateRegion(points)}
    >
      {routeGroups.map((group, index) => (
        <Polyline
          key={index}
          coordinates={group.points.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          }))}
          strokeColor={group.color}
          strokeWidth={4}
        />
      ))}

      {showMarkers && markers.map((marker, index) => (
        <Marker
          key={`marker-${index}`}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.pointType === 'start' ? 'Start' : 'End'}
          pinColor={marker.pointType === 'start' ? 'green' : 'red'}
        />
      ))}
    </MapView>
  );
};

// Вспомогательные функции
const groupPointsByRoute = (points: RoutePoint[]) => {
  // Здесь должна быть логика группировки точек по routeId
  // Это упрощенный пример - вам нужно адаптировать его под вашу структуру данных
  const routes: { [key: number]: RoutePoint[] } = {};
  points.forEach(point => {
    if (!routes[point.routeId]) {
      routes[point.routeId] = [];
    }
    routes[point.routeId].push(point);
  });
  return Object.values(routes).map(group => ({ points: group, color: '#0000FF' }));
};

const calculateRegion = (points: RoutePoint[]) => {
  // Логика расчета региона для отображения всех точек
  // ...
};

export default RouteMapViewer;
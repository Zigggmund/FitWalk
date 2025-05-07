// src/app/map.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { getRouteById, getAllRoutesWithPoints } from '@/services/routeRepository';
import { RoutePoint, RouteWithPoints } from '@/types/routes';


const MapScreen = () => {
  const params = useLocalSearchParams();
  const [routes, setRoutes] = useState<RouteWithPoints[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteWithPoints | null>(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        if (params.routeId) {
          const route = await getRouteById(Number(params.routeId));
          setSelectedRoute(route);
          setRegion(calculateRegion(route.points));
        } else {
          const allRoutes = await getAllRoutesWithPoints();
          setRoutes(allRoutes);
          setRegion(calculateRegion(allRoutes.flatMap(r => r.points)));
        }
      } catch (error) {
        console.error('Error loading routes:', error);
      }
    };

    loadRoutes();
  }, [params.routeId]);

  const renderMarker = (point: RoutePoint, label: string, color: string, title: string) => (
    <Marker
      coordinate={{
        latitude: point.latitude,
        longitude: point.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false} // Улучшает производительность
      title={title}
    >
      <View style={[styles.markerContainer, { borderColor: color }]}>
        <View style={[styles.marker, { backgroundColor: color }]}>
          <Text style={styles.markerText}>{label}</Text>
        </View>
      </View>
    </Marker>
  );

  if (!region) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const displayRoutes = selectedRoute ? [selectedRoute] : routes;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {displayRoutes.map((route, index) => {
          const color = getColorForIndex(index);
          const startPoint = route.points.find(p => p.pointType === 'start');
          const endPoint = route.points.find(p => p.pointType === 'end');

          return (
            <React.Fragment key={route.id}>
              <Polyline
                coordinates={route.points.map(p => ({
                  latitude: p.latitude,
                  longitude: p.longitude,
                }))}
                strokeColor={color}
                strokeWidth={4}
              />

              {startPoint && renderMarker(
                startPoint,
                'S',
                color,
                `Start: ${route.title}`
              )}

              {endPoint && renderMarker(
                endPoint,
                'F',
                color,
                `End: ${route.title}`
              )}
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
};

// Генерация разных цветов для маршрутов
const getColorForIndex = (index: number) => {
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#008000',
    '#FF6347', '#4682B4', '#D2691E', '#9932CC'
  ];
  return colors[index % colors.length];
};

// Расчет региона для отображения всех точек
const calculateRegion = (points: RoutePoint[]) => {
  if (!points || points.length === 0) return null;

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLng = points[0].longitude;
  let maxLng = points[0].longitude;

  points.forEach(point => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });

  const padding = 0.01; // Небольшой отступ

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.abs(maxLat - minLat) + padding,
    longitudeDelta: Math.abs(maxLng - minLng) + padding,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapScreen;
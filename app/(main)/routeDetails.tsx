// src/app/route-details.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { getRouteById } from '@/services/routeRepository';
import { RoutePoint } from '@/types/routes';
import { useLanguage } from '@/context/LanguageContext';

interface RouteData {
  route: {
    id: number;
    title: string;
    description?: string;
  };
  points: RoutePoint[];
}

const RouteDetailsScreen = () => {
  const { l } = useLanguage()
  const params = useLocalSearchParams();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoute = async () => {
      try {
        if (params.routeId) {
          const data = await getRouteById(Number(params.routeId));
          if (data.route) {
            setRouteData({
              route: {
                id: data.route.id!,
                title: data.route.title,
                description: data.route.description,
              },
              points: data.points,
            });
          }
        }
      } catch (error) {
        console.error('Error loading route:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [params.routeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!routeData) {
    return (
      <View style={styles.container}>
        <Text>{l.errorRouteNotFound}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={calculateRegion(routeData.points)}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <Polyline
          coordinates={routeData.points.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          }))}
          strokeColor="#FF0000"
          strokeWidth={4}
        />

        <Marker
          coordinate={{
            latitude: routeData.points[0].latitude,
            longitude: routeData.points[0].longitude,
          }}
          pinColor="green"
          title="Start"
        />

        {routeData.points.length > 1 && (
          <Marker
            coordinate={{
              latitude: routeData.points[routeData.points.length - 1].latitude,
              longitude: routeData.points[routeData.points.length - 1].longitude,
            }}
            pinColor="red"
            title="End"
          />
        )}
      </MapView>

      <View style={styles.infoPanel}>
        <Text style={styles.title}>{routeData.route.title}</Text>
        {routeData.route.description && (
          <Text style={styles.description}>{routeData.route.description}</Text>
        )}
      </View>
    </View>
  );
};

// Функция calculateRegion остается без изменений
const calculateRegion = (points: RoutePoint[]) => {
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

  const padding = 0.01;
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default RouteDetailsScreen;
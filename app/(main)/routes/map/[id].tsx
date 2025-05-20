import { Route, RoutePoint } from '@/types/routes';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';

import SingleRouteMap from '@/components/route/SingleRouteMap';
import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

import { getRouteById } from '@/services/routeRepository';
import { calculateRegion } from '@/utils/calculateRegion';

const RouteDetailsScreen = () => {
  const { l } = useLanguage();
  const { id } = useLocalSearchParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных маршрута
  useEffect(() => {
    loadRouteWithPoints();
  }, [id]);

  const loadRouteWithPoints = async () => {
    try {
      setLoading(true);
      const { route: loadedRoute, points: loadedPoints } = await getRouteById(
        Number(id),
      );
      if (loadedRoute) {
        setRoute(loadedRoute);
        setPoints(loadedPoints);
      }
    } catch (error) {
      console.error('Error loading route:', error);
    } finally {
      setLoading(false);
    }
  };

  // отображение текущей позиции
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.container}>
        <SText>{l.errorRouteNotFound}</SText>
      </View>
    );
  }

  console.log(points);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        initialRegion={calculateRegion(points)}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <SingleRouteMap points={points} />

        {/* Текущая позиция */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            pinColor="blue"
            title="You are here"
          />
        )}
      </MapView>

      {/* Title */}
      <View style={styles.infoPanel}>
        <Text style={styles.title}>{route.title}</Text>
        {route.description && (
          <Text style={styles.description}>{route.description}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    borderColor: colors.green.textBlock,
    borderWidth: 5,
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

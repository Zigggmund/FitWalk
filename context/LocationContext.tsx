import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';

import { useLanguage } from '@/context/LanguageContext';
import { LatLng } from 'react-native-maps';
import { LocationSubscription } from 'expo-location';

type LocationContextType = {
  location: Location.LocationObject | null;
  permissionGranted: boolean;
  retryRequest: () => void;

  locations: LatLng[]; // ← массив точек маршрута
  startTracking: () => void;
  stopTracking: () => void;
  clearLocations: () => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { l } = useLanguage();

  const [locations, setLocations] = useState<LatLng[]>([]);
  const locationSubscription = useRef<LocationSubscription | null>(null);

  const clearLocations = () => {
    setLocations([]);  // сброс массива координат
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,     // 3 секунды
        distanceInterval: 10,   // 10 метров
      },
      (loc) => {
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(loc);
        setLocations((prev) => [...prev, coords]);
      }
    );
  };

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
  };

  const requestPermission = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        return;
      }

      setPermissionGranted(true);

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (e) {
      console.error(`${l.errorGetLocation}:`, e);
      setLocationError(l.errorUnableToGetLocation);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>{l.errorGeoPermissionNeeded}</Text>
        <Button title={l.btnTryAgain} onPress={requestPermission} />
      </View>
    );
  }

  if (permissionGranted && !location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>
          {locationError ?? l.errorUnableToWorkWithoutGeo}
        </Text>
        <Button title={l.btnTryAgain} onPress={requestPermission} />
      </View>
    );
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        permissionGranted,
        retryRequest: requestPermission,
        locations,
        startTracking,
        stopTracking,
        clearLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';

import { useLanguage } from '@/context/LanguageContext';

type LocationContextType = {
  location: Location.LocationObject | null;
  permissionGranted: boolean;
  retryRequest: () => void;
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
  const [loading, setLoading] = useState(true);
  const { l } = useLanguage();

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionGranted(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setPermissionGranted(true);
    } catch (e) {
      console.error(`${l.errorGetLocation}:`, e);
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

  return (
    <LocationContext.Provider
      value={{ location, permissionGranted, retryRequest: requestPermission }}
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

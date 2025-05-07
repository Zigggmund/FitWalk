import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

type Point = {
  latitude: number;
  longitude: number;
  timestamp?: number;
};

type ContextType = {
  locations: Point[];
  startTracking: () => void;
  stopTracking: () => void;
  clearLocations: () => void;
};

const LocationContext = createContext<ContextType>({
  locations: [],
  startTracking: () => {},
  stopTracking: () => {},
  clearLocations: () => {}
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Point[]>([]);
  const [watching, setWatching] = useState(false);
  const [sub, setSub] = useState<Location.LocationSubscription>();

  const startTracking = async () => {
    setLocations([]);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    setWatching(true);
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1
      },
      (loc) => {
        setLocations(prev => [...prev, {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: Date.now()
        }]);
      }
    );
    setSub(subscription);
  };

  const stopTracking = () => {
    sub?.remove();
    setWatching(false);
  };

  const clearLocations = () => setLocations([]);

  useEffect(() => {
    return () => sub?.remove();
  }, []);

  return (
    <LocationContext.Provider
      value={{ locations, startTracking, stopTracking, clearLocations }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
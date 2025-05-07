import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useLocation } from '@/hooks/LocationContext';
import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
import GreenButton from '@/components/ui/GreenButton';
import calculateDistance from '@/utils/calculateDistance';
import SText from '@/components/ui/CustomFontText/SText';

const CreatingARoute = () => {
  const router = useRouter();
  const { locations, startTracking, stopTracking } = useLocation();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    startTracking();
    const timer = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => {
      stopTracking();
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (locations.length > 1) {
      const newDistance = calculateDistance(locations);
      setDistance(newDistance);

      // Center map on current location when new points are added
      if (mapRef.current && locations.length > 0) {
        const lastLocation = locations[locations.length - 1];
        mapRef.current.animateToRegion({
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }
  }, [locations]);

  const handleFinish = () => {
    router.push({
      pathname: '/savingARoute',
      params: {
        time: time.toString(),
        distance: distance.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={
          locations.length > 0 ? {
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } : undefined
        }
      >
        {locations.length > 0 && (
          <>
            <Polyline
              coordinates={locations}
              strokeColor="#0000FF"
              strokeWidth={4}
            />
            <Marker
              coordinate={locations[0]}
              pinColor="green"
              title="Start"
            />
            {locations.length > 1 && (
              <Marker
                coordinate={locations[locations.length - 1]}
                pinColor="red"
                title="Current"
              />
            )}
          </>
        )}
      </MapView>

      <View style={styles.controls}>
        <GreenButton onPress={handleFinish}>
          <SText style={styles.btnText}>Завершить маршрут</SText>
        </GreenButton>
        <RouteTrackingPanel time={time} distance={distance} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
  },
  btnText: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default CreatingARoute;
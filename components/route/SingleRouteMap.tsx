import { RoutePoint } from '@/types/routes';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

interface SingleRouteMapProps {
  points: RoutePoint[];
  color?: string;
  showMarkers?: boolean;
  showUserLocation?: boolean;
  style?: object;
}

const SingleRouteMap: React.FC<SingleRouteMapProps> = ({
  points,
  color = '#FF0000',
  showMarkers = true,
  showUserLocation = true,
  style = {},
}) => {
  if (points.length === 0) return null;

  const region = calculateRegion(points);

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
      >
        <Polyline
          coordinates={points.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          }))}
          strokeColor={color}
          strokeWidth={4}
        />

        {showMarkers && (
          <>
            <Marker
              coordinate={{
                latitude: points[0].latitude,
                longitude: points[0].longitude,
              }}
              pinColor="green"
              title="Start"
            />
            {points.length > 1 && (
              <Marker
                coordinate={{
                  latitude: points[points.length - 1].latitude,
                  longitude: points[points.length - 1].longitude,
                }}
                pinColor="red"
                title="End"
              />
            )}
          </>
        )}
      </MapView>
    </View>
  );
};

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
  map: {
    flex: 1,
  },
});

export default SingleRouteMap;

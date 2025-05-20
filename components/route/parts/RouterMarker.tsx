import { RoutePoint } from '@/types/routes';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';

import SText from '@/components/ui/CustomFontText/SText';

type RouterMarkerProps = {
  point: RoutePoint;
  color: string;
  number: number;
  onPress?: () => void;
};

export const RouterMarker = ({
  point,
  color,
  number,
  onPress = () => {},
}: RouterMarkerProps) => (
  <Marker
    coordinate={{
      latitude: point.latitude,
      longitude: point.longitude,
    }}
    anchor={{ x: 0.3, y: 0.3 }}
    tracksViewChanges={true}
    title={`point-${number}`}
    onPress={onPress}
  >
    <View style={[styles.markerContainer, { borderColor: 'black' }]}>
      <View style={[styles.marker, { backgroundColor: color }]}>
        <SText style={styles.markerText}>{number}</SText>
      </View>
    </View>
  </Marker>
);

const styles = StyleSheet.create({
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
  markerContainer: {
    borderColor: 'black',
    width: 40,
    height: 40,
  },
});

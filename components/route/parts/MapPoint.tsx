import React from 'react';
import { Circle } from 'react-native-maps';

interface MapPointProps {
  latitude: number;
  longitude: number;
  color: string;
}

export const MapPoint = ({ latitude, longitude, color }: MapPointProps) => {
  return (
    <Circle
      key={`${latitude}-${longitude}`}
      center={{
        latitude: latitude,
        longitude: longitude,
      }}
      radius={20} // в метрах
      strokeColor="black"
      fillColor={color}
    />
  );
};

import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';

const RouteWeatherDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <SText>route{id}-weather</SText>
    </View>
  );
};

export default RouteWeatherDetails;

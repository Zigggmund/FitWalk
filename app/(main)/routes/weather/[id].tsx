import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';
import RouteHeader from '@/components/ui/header/RouteHeader';
import { routes } from '@/constants/routes';

const RouteWeatherDetails = () => {
  const { id } = useLocalSearchParams();
  const numericId = Number(String(id).split('-')[0]);
  const route = routes.find(route => route.id == numericId);
  console.log(route);

  if (!route) {
    return <SText>404</SText>;
  }

  return (
    <View>
      <RouteHeader
        isMainPage={false}
        routeLength={route?.length}
        routeTitle={route?.title}
      />
    </View>
  );
};

export default RouteWeatherDetails;

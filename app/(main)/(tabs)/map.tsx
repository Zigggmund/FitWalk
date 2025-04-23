import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { images } from '@/constants/images';

const RouteWeatherMap = () => {
  return (
    <ImageBackground style={styles.container} source={images.mapAllRoutes}>
      <View></View>
    </ImageBackground>
    // <MapView
    //   style={{ flex: 1 }}
    //   initialRegion={{
    //     latitude: 56.01,
    //     longitude: 92.87,
    //     latitudeDelta: 0.05,
    //     longitudeDelta: 0.05,
    //   }}
    // >
    //   {/* Маркеры или путь маршрута */}
    //   <Marker coordinate={{ latitude: 56.01, longitude: 92.87 }} />
    // </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RouteWeatherMap;

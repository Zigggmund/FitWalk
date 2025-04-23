import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import RouteItem from '@/components/route/RouteItem';
import Line from '@/components/ui/parts/Line';
import { WeatherPanel } from '@/components/WeatherPanel';
import { routes } from '@/constants/routes';

const Weather = () => {
  return (
    <View>
      <View style={styles.container}>
        <WeatherPanel temperature={24} wind={12} weatherType={'rain'} />
      </View>

      <FlatList
        data={routes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RouteItem route={item} isMainPage={false} />}
        ItemSeparatorComponent={Line} // Используем Line как разделитель
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default Weather;

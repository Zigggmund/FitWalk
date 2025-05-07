import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import RouteItem from '@/components/route/RouteItem';
import Line from '@/components/ui/parts/Line';
import { WeatherPanel } from '@/components/WeatherPanel';
import { getAllRoutes } from '@/services/routeRepository';
import SText from '@/components/ui/CustomFontText/SText';
import { getCurrentWeather } from '@/services/weatherService';
import { RouteWithPoints } from '@/types/routes';

const Weather = () => {
  const [routes, setRoutes] = useState<RouteWithPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Запрашиваем разрешение на геолокацию
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const weather = await getCurrentWeather(latitude, longitude);
              setCurrentWeather(weather);
            },
            (error) => {
              console.error('Error getting location:', error);
              setError('Не удалось определить местоположение');
            }
          );
        }

        // Загружаем маршруты
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <WeatherPanel temperature={24} wind={12} weatherType={'rain'} />
      </View>

      <FlatList
        data={routes}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <RouteItem route={item} isMainPage={false} />}
        ItemSeparatorComponent={Line}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <SText style={styles.defaultText}>
            Нет сохраненных маршрутов
          </SText>
        }
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

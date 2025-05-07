import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import RouteItem from '@/components/route/RouteItem';
import Line from '@/components/ui/parts/Line';
import { WeatherPanel } from '@/components/WeatherPanel';
import { Route } from '@/types/routes';
import { getAllRoutes } from '@/services/routeRepository';
import SText from '@/components/ui/CustomFontText/SText';

const Weather = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (err) {
        setError('Не удалось загрузить маршруты');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
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

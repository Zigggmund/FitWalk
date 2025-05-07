import React, { useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import RouteItem from '@/components/route/RouteItem';
import PageHeader from '@/components/ui/PageHeader';
import Line from '@/components/ui/parts/Line';
import { getAllRoutes } from '@/services/routeRepository';
import { Route } from '@/types/routes';
import SText from '@/components/ui/CustomFontText/SText';

export default function Index() {
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
    <View style={{ flex: 1 }}>
      <PageHeader text={'Ваши маршруты:'} />
      <FlatList
        data={routes}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <RouteItem route={item} />}
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
}

const styles = StyleSheet.create({
  defaultText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 34,
  },
});
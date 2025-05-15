import { Route } from '@/types/routes';

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import RouteItem from '@/components/route/RouteItem';
import SText from '@/components/ui/CustomFontText/SText';
import PageHeader from '@/components/ui/PageHeader';
import Line from '@/components/ui/parts/Line';
import { useLanguage } from '@/context/LanguageContext';

import { getAllRoutes } from '@/services/routeRepository';

export default function Index() {
  const { l } = useLanguage();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (err) {
        setError(l.errorLoadingRoutes);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  if (loading) {
    return (
      <View style={styles.defaultContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.defaultContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PageHeader text={l.yourRoutes + ':'} />
      <FlatList
        data={routes}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <RouteItem route={item} />}
        ItemSeparatorComponent={Line}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <SText style={styles.defaultText}>{l.noRoutes}</SText>
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
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

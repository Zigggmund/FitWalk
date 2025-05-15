import { Route } from '@/types/routes';
import { WeatherData } from '@/types/weatherData';

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
import Line from '@/components/ui/parts/Line';
import { WeatherPanel } from '@/components/WeatherPanel';
import { useLanguage } from '@/context/LanguageContext';

import { getAllRoutes } from '@/services/routeRepository';
import { useLocation } from '@/context/LocationContext';
import { getCurrentWeather } from '@/services/weatherService';

export default function Weather() {
  const { l } = useLanguage();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      getCurrentWeather(latitude, longitude).then(setWeather);
      getAllRoutes().then(setRoutes);
    }
  }, [location]);

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
      <View style={styles.container}>
        {weather ? (
          <WeatherPanel
            temperature={weather.temperature}
            wind={weather.windSpeed}
            weatherType={weather.weatherType}
          />
        ) : (
          <ActivityIndicator size="small" color="#000" />
        )}
      </View>
      <FlatList
        data={routes}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <RouteItem route={item} isMainPage={false}/>}
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
  container: {
    marginVertical: 20,
  },
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

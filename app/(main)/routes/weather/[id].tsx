import { Route, RoutePoint } from '@/types/routes';
import { WeatherData } from '@/types/weatherData';

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import RouteHeader from '@/components/route/RouteHeader';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import StartTimeModal from '@/components/weather/StartTimeModal';
import { WeatherPanel } from '@/components/WeatherPanel';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

import { getRouteById } from '@/services/routeRepository';
import { getWeatherForecast } from '@/services/weatherService';

const RouteWeatherDetails = () => {
  const { l } = useLanguage();
  const { id } = useLocalSearchParams();

  const [startTime, setStartTime] = useState<string>('');
  const [finishTime, setFinishTime] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [startWeather, setStartWeather] = useState<WeatherData | null>(null);
  const [finishWeather, setFinishWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRouteData();
  }, [id]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      const { route: loadedRoute, points: loadedPoints } = await getRouteById(
        Number(id),
      );
      if (loadedRoute) {
        setRoute(loadedRoute);
        setPoints(loadedPoints);
        setInitialTime(loadedRoute);
        console.log(loadedRoute);
        console.log(loadedPoints);
      }
    } catch (error) {
      console.error('Error loading route:', error);
      setError(l.errorRouteNotFound);
    } finally {
      setLoading(false);
    }
  };

  // для вычисления времени по ТЕКУЩЕМУ часовому поясу
  const pad = (num: number) => String(num).padStart(2, '0');
  const toLocalDateTimeString = (date: Date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Месяцы с 0
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // задает начальное время
  const setInitialTime = (route: Route) => {
    const travelMinutes =
      typeof route.travelTime === 'number' ? route.travelTime : 0;
    const now = new Date();
    const formattedStart = toLocalDateTimeString(now);
    setStartTime(formattedStart);

    const finish = new Date(now.getTime() + travelMinutes * 60000);
    console.log(finish);
    const formattedFinish = toLocalDateTimeString(finish);
    setFinishTime(formattedFinish);
  };

  const flipRoute = () => {
    if (points.length > 1) {
      const flipped = [...points].reverse().map(point => {
        if (point.pointType == 'start') return { ...point, pointType: 'end' };
        if (point.pointType == 'end') return { ...point, pointType: 'start' };
        return point;
      });
      setPoints(flipped as RoutePoint[]);
    }
  };

  // обновление времени
  useEffect(() => {
    if (!route || points.length === 0 || !startTime) return;

    const start = new Date(startTime);
    const finish = new Date(start.getTime() + (route.travelTime ?? 0) * 60000);
    setFinishTime(toLocalDateTimeString(finish));

    const startPoint = points.find(p => p.pointType === 'start');
    const endPoint = points.find(p => p.pointType === 'end');

    if (!startPoint || !endPoint) {
      setError(l.errorStartEndPointsNotFound);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const formatHourString = (date: Date) =>
          date.toISOString().slice(0, 13); // "yyyy-mm-ddThh"

        const startWeatherData = await getWeatherForecast(
          startPoint.latitude,
          startPoint.longitude,
          formatHourString(start),
        );
        const finishWeatherData = await getWeatherForecast(
          endPoint.latitude,
          endPoint.longitude,
          formatHourString(finish),
        );
        setStartWeather(startWeatherData);
        setFinishWeather(finishWeatherData);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(l.errorFetchingWeather);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [startTime, route, points]);

  const formatDate = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SText>{l.loading}...</SText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SText>{error}</SText>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.container}>
        <SText>{l.errorRouteNotFound}</SText>
      </View>
    );
  }

  return (
    <ScrollView>
      {/*Модальное окно*/}
      <StartTimeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={newStartTime => {
          setStartTime(newStartTime);
          setModalVisible(false);
        }}
      />

      <RouteHeader
        isMainPage={false}
        routeLength={route.length ?? 0}
        routeTitle={route.title ?? ''}
      />
      <GreenButton onPress={() => setModalVisible(true)}>
        <SText style={styles.btnText}>{l.btnSetStartTime}</SText>
      </GreenButton>
      <GreenButton onPress={flipRoute}>
        <SText style={styles.btnText}>{l.btnFlipRoute}</SText>
      </GreenButton>

      <SText style={styles.header}>{l.start}</SText>
      <View style={styles.timeContainer}>
        <SText style={styles.time}>({formatDate(startTime)}</SText>
        <SText style={styles.time}>-</SText>
        <SText style={styles.time}>{formatTime(startTime)})</SText>
      </View>
      {startWeather ? (
        !isNaN(startWeather.temperature) &&
        !isNaN(startWeather.windSpeed) &&
        startWeather.time !== undefined ? (
          <WeatherPanel
            temperature={startWeather.temperature}
            wind={startWeather.windSpeed}
            weatherType={startWeather.weatherType}
          />
        ) : (
          <View style={styles.mainContainer}>
            <SText style={{ fontSize: 28 }}>{l.errorDateTooLate}</SText>
          </View>
        )
      ) : null}
      <SText style={styles.header}>{l.finish}</SText>
      <View style={styles.timeContainer}>
        <SText style={styles.time}>({formatDate(finishTime)}</SText>
        <SText style={styles.time}>-</SText>
        <SText style={styles.time}>{formatTime(finishTime)})</SText>
      </View>
      {finishWeather ? (
        !isNaN(finishWeather.temperature) &&
        !isNaN(finishWeather.windSpeed) &&
        finishWeather.time !== undefined ? (
          <WeatherPanel
            temperature={finishWeather.temperature}
            wind={finishWeather.windSpeed}
            weatherType={finishWeather.weatherType}
          />
        ) : (
          <View style={styles.mainContainer}>
            <SText style={{ fontSize: 28 }}>{l.errorDateTooLate}</SText>
          </View>
        )
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    padding: 16,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.green.textBlock,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '20%',
  },
  header: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  btnText: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default RouteWeatherDetails;

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import RouteHeader from '@/components/route/RouteHeader';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import StartTimeModal from '@/components/weather/StartTimeModal';
import { WeatherPanel } from '@/components/WeatherPanel';
import { routes } from '@/constants/routes';

const RouteWeatherDetails = () => {
  const { id } = useLocalSearchParams();
  const route = routes.find(route => route.id == Number(id));

  const [startTime, setStartTime] = useState<string>('');
  const [finishTime, setFinishTime] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const currentTime = new Date();
    const tzOffset = currentTime.getTimezoneOffset() * 60000;
    const localTime = new Date(currentTime.getTime() - tzOffset);
    const formattedTime = localTime.toISOString().slice(0, 16); // 'yyyy-mm-ddThh:mm'
    setStartTime(formattedTime);
  }, []);

  useEffect(() => {
    if (route && startTime) {
      const start = new Date(startTime);
      const finish = new Date(start.getTime() + route.travelTime * 60000);

      const finishLocal = new Date(
        finish.getTime() - finish.getTimezoneOffset() * 60000,
      );
      const formattedFinishTime = finishLocal.toISOString().slice(0, 16);
      setFinishTime(formattedFinishTime);
    }
  }, [startTime, route]);

  // форматирование даты
  const formatDate = (time: string): string => {
    const startDate = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return startDate.toLocaleString('ru-RU', options);
  };
  // форматирование времени
  const formatTime = (time: string): string => {
    const startDate = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return startDate.toLocaleString('ru-RU', options);
  };

  if (!route) {
    return <SText>404</SText>;
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
        routeLength={route.length}
        routeTitle={route.title}
      />
      <GreenButton onPress={() => setModalVisible(true)}>
        <SText style={styles.btnText}>Задать стартовое время</SText>
      </GreenButton>

      <SText style={styles.header}>Старт</SText>
      <View style={styles.timeContainer}>
        <SText style={styles.time}>({formatDate(startTime)}</SText>
        <SText style={styles.time}>-</SText>
        <SText style={styles.time}>{formatTime(startTime)})</SText>
      </View>
      <WeatherPanel temperature={14} wind={13} weatherType={'thunder'} />

      <SText style={styles.header}>Финиш</SText>
      <View style={styles.timeContainer}>
        <SText style={styles.time}>({formatDate(finishTime)}</SText>
        <SText style={styles.time}>-</SText>
        <SText style={styles.time}>{formatTime(finishTime)})</SText>
      </View>
      <WeatherPanel temperature={18} wind={7} weatherType={'rain'} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

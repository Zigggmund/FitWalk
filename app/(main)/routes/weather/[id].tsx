import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import RouteHeader from '@/components/route/RouteHeader';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import StartTimeModal from '@/components/weather/StartTimeModal';
import { WeatherPanel } from '@/components/WeatherPanel';
import { routes } from '@/constants/routes';
import { useLanguage } from '@/context/LanguageContext';

const RouteWeatherDetails = () => {
  const { l } = useLanguage();
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
        <SText style={styles.btnText}>{l.btnSetStartTime}</SText>
      </GreenButton>

      <SText style={styles.header}>{l.start}</SText>
      <View style={styles.timeContainer}>
        <SText style={styles.time}>({formatDate(startTime)}</SText>
        <SText style={styles.time}>-</SText>
        <SText style={styles.time}>{formatTime(startTime)})</SText>
      </View>
      <WeatherPanel temperature={14} wind={13} weatherType={'thunder'} />

      <SText style={styles.header}>{l.finish}</SText>
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

//import React, { useEffect, useState } from 'react';
// import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
//
// import RouteHeader from '@/components/route/RouteHeader';
// import SText from '@/components/ui/CustomFontText/SText';
// import GreenButton from '@/components/ui/GreenButton';
// import StartTimeModal from '@/components/weather/StartTimeModal';
// import { WeatherPanel } from '@/components/WeatherPanel';
// import { getWeatherForecast } from '@/services/weatherService';
// import { RouteWithPoints } from '@/types/routes';
// import { getAllRoutes } from '@/services/routeRepository';
// import { WeatherData } from '@/types/weatherData';
//
// const RouteWeatherDetails = () => {
//   const { id } = useLocalSearchParams();
//   const [route, setRoute] = useState<RouteWithPoints | null>(null);
//   const [startTime, setStartTime] = useState<string>('');
//   const [finishTime, setFinishTime] = useState<string>('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [startWeather, setStartWeather] = useState<WeatherData | null>(null);
//   const [finishWeather, setFinishWeather] = useState<WeatherData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   // Загружаем данные маршрута
//   useEffect(() => {
//     const loadRoute = async () => {
//       try {
//         const routes = await getAllRoutes();
//         const foundRoute = routes.find(r => r.id === Number(id));
//         setRoute(foundRoute || null);
//
//         // Устанавливаем время по умолчанию
//         const currentTime = new Date();
//         const tzOffset = currentTime.getTimezoneOffset() * 60000;
//         const localTime = new Date(currentTime.getTime() - tzOffset);
//         const formattedTime = localTime.toISOString().slice(0, 16);
//         setStartTime(formattedTime);
//       } catch (err) {
//         setError('Не удалось загрузить маршрут');
//         console.error(err);
//       }
//     };
//
//     loadRoute();
//   }, [id]);
//
//   // Загружаем погоду при изменении времени старта или маршрута
//   useEffect(() => {
//     if (!route || !startTime || route.points.length === 0) return;
//
//     const startPoint = route.points.find(p => p.pointType === 'start');
//     const endPoint = route.points.find(p => p.pointType === 'end');
//
//     if (!startPoint || !endPoint) {
//       setError('Маршрут не содержит начальной или конечной точки');
//       return;
//     }
//
//     const start = new Date(startTime);
//     const finish = new Date(start.getTime() + (route.travelTime || 0) * 60000);
//
//     const finishLocal = new Date(
//       finish.getTime() - finish.getTimezoneOffset() * 60000,
//     );
//     const formattedFinishTime = finishLocal.toISOString().slice(0, 16);
//     setFinishTime(formattedFinishTime);
//
//     // Форматируем даты для WeatherAPI
//     const formatForAPI = (date: Date) => {
//       return date.toISOString().split('T')[0] + ' ' +
//         date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
//     };
//
//     const loadWeather = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//
//         // Погода для стартовой точки
//         const startWeatherData = await getWeatherForecast(
//           startPoint.latitude,
//           startPoint.longitude,
//           formatForAPI(start)
//         );
//         setStartWeather(startWeatherData);
//
//         // Погода для конечной точки
//         const finishWeatherData = await getWeatherForecast(
//           endPoint.latitude,
//           endPoint.longitude,
//           formatForAPI(finish)
//         );
//         setFinishWeather(finishWeatherData);
//       } catch (err) {
//         setError('Не удалось загрузить данные о погоде');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     loadWeather();
//   }, [startTime, route]);
//
//   // Функции форматирования даты и времени остаются без изменений
//   const formatDate = (time: string): string => {
//     const date = new Date(time);
//     const options: Intl.DateTimeFormatOptions = {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//     };
//     return date.toLocaleString('ru-RU', options);
//   };
//
//   const formatTime = (time: string): string => {
//     const date = new Date(time);
//     const options: Intl.DateTimeFormatOptions = {
//       hour: 'numeric',
//       minute: 'numeric',
//     };
//     return date.toLocaleString('ru-RU', options);
//   };
//
//   if (!route) {
//     return <SText>Маршрут не найден</SText>;
//   }
//
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//
//   if (error) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ color: 'red' }}>{error}</Text>
//       </View>
//     );
//   }
//
//   return (
//     <ScrollView>
//       <StartTimeModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onSave={newStartTime => {
//           setStartTime(newStartTime);
//           setModalVisible(false);
//         }}
//       />
//
//       <RouteHeader
//         isMainPage={false}
//         routeLength={route.length || 0}
//         routeTitle={route.title}
//       />
//
//       <GreenButton onPress={() => setModalVisible(true)}>
//         <SText style={styles.btnText}>Задать стартовое время</SText>
//       </GreenButton>
//
//       <SText style={styles.header}>Старт</SText>
//       <View style={styles.timeContainer}>
//         <SText style={styles.time}>({formatDate(startTime)}</SText>
//         <SText style={styles.time}>-</SText>
//         <SText style={styles.time}>{formatTime(startTime)})</SText>
//       </View>
//       {startWeather && (
//         <WeatherPanel
//           temperature={startWeather.temperature}
//           wind={startWeather.windSpeed}
//           weatherType={startWeather.weatherType}
//           description={startWeather.description}
//         />
//       )}
//
//       <SText style={styles.header}>Финиш</SText>
//       <View style={styles.timeContainer}>
//         <SText style={styles.time}>({formatDate(finishTime)}</SText>
//         <SText style={styles.time}>-</SText>
//         <SText style={styles.time}>{formatTime(finishTime)})</SText>
//       </View>
//       {finishWeather && (
//         <WeatherPanel
//           temperature={finishWeather.temperature}
//           wind={finishWeather.windSpeed}
//           weatherType={finishWeather.weatherType}
//           description={finishWeather.description}
//         />
//       )}
//     </ScrollView>
//   );
// };
//
//
// const styles = StyleSheet.create({
//   timeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: '20%',
//   },
//   header: {
//     textAlign: 'center',
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   time: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   btnText: {
//     fontSize: 30,
//     textAlign: 'center',
//   },
// });
//
// export default RouteWeatherDetails;
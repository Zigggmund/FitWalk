import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import { images } from '@/constants/images';
const CreatingARoute = () => {
  const router = useRouter();

  return (
    <ImageBackground style={styles.container} source={images.mapRoute}>
      <View style={[styles.container, styles.flexContainer]}>
        <GreenButton onPress={() => router.push('/savingARoute')}>
          <SText style={styles.btnText}>Завершить маршрут</SText>
        </GreenButton>
        <RouteTrackingPanel />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  btnText: {
    fontSize: 30,
    textAlign: 'center',
    paddingVertical: -5,
  },
});

export default CreatingARoute;

// import React, { useState, useEffect } from 'react';
// import { ImageBackground, StyleSheet, View } from 'react-native';
// import { useRouter } from 'expo-router';
// import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
// import SText from '@/components/ui/CustomFontText/SText';
// import GreenButton from '@/components/ui/GreenButton';
// import { images } from '@/constants/images';
// import { useLocation } from '@/contexts/LocationContext';
// import calculateDistance from '@/utils/calculateDistance';
//
// const CreatingARoute = () => {
//   const router = useRouter();
//   const { locations, startTracking, stopTracking } = useLocation();
//   const [time, setTime] = useState(0); // В секундах
//   const [distance, setDistance] = useState(0); // В метрах
//
//   // Запуск трекинга при монтировании
//   useEffect(() => {
//     startTracking();
//     const timer = setInterval(() => setTime(prev => prev + 1), 1000);
//     return () => {
//       stopTracking();
//       clearInterval(timer);
//     };
//   }, []);
//
//   // Расчет дистанции при изменении точек
//   useEffect(() => {
//     if (locations.length > 1) {
//       setDistance(calculateDistance(locations));
//     }
//   }, [locations]);
//
//   const handleFinish = () => {
//     router.push({
//       pathname: '/savingARoute',
//       params: {
//         time: time,
//         distance: distance,
//       }
//     });
//   };
//
//   return (
//     <ImageBackground style={styles.container} source={images.mapRoute}>
//       <View style={[styles.container, styles.flexContainer]}>
//         <GreenButton onPress={handleFinish}>
//           <SText style={styles.btnText}>Завершить маршрут</SText>
//         </GreenButton>
//         <RouteTrackingPanel time={time} distance={distance} />
//       </View>
//     </ImageBackground>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   flexContainer: {
//     flexDirection: 'column',
//     justifyContent: 'flex-end',
//   },
//   btnText: {
//     fontSize: 30,
//     textAlign: 'center',
//     paddingVertical: -5,
//   },
// });
//
// export default CreatingARoute;

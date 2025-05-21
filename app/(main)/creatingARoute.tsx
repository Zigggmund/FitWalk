import MapView, { Polyline, Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useLocation } from '@/context/LocationContext';
import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
import GreenButton from '@/components/ui/GreenButton';
import calculateDistance from '@/utils/calculateDistance';
import SText from '@/components/ui/CustomFontText/SText';
import { useLanguage } from '@/context/LanguageContext';
import { RouterMarker } from '@/components/route/parts/RouterMarker';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RoutePoint } from '@/types/routes';

const MIN_DISTANCE = 500; // метров

const CreatingARoute = () => {
  const { l } = useLanguage();
  const router = useRouter();
  const { locations, startTracking, stopTracking, clearLocations } = useLocation();
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [routePoints, setRoutePoints] = useState<
    { latitude: number; longitude: number; distance: number }[]
  >([]);
  const mapRef = useRef<MapView | null>(null);

  // очистка полей после выхода
  useEffect(() => {
    startTracking();

    setTime(0);
    setDistance(0);
    setRoutePoints([]);

    const timer = setInterval(() => setTime(prev => prev + 1), 1000);

    return () => {
      stopTracking();
      clearInterval(timer);

      // Если есть функция очистки локаций из контекста, то её тоже можно вызвать здесь,
      // чтобы сбрасывать весь трек при выходе.
      clearLocations();
    };
  }, []);

  // начало маршрута
  useEffect(() => {
    startTracking();
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => {
      stopTracking();
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (locations.length < 2) return;

    const totalDistance = calculateDistance(locations);
    setDistance(totalDistance);

    // Добавляем промежуточную точку, если прошло 500м от последней
    if (
      routePoints.length === 0 ||
      totalDistance - routePoints[routePoints.length - 1].distance >= MIN_DISTANCE
    ) {
      setRoutePoints((prev) => [
        ...prev,
        {
          latitude: locations[locations.length - 1].latitude,
          longitude: locations[locations.length - 1].longitude,
          distance: totalDistance,
        },
      ]);
    }
      // приближение на местоположение юзера
      if (locations.length > 0 && mapRef.current) {
        const loc = locations[locations.length - 1];
        mapRef.current.animateToRegion({
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.005, // меньше = больше приближение
          longitudeDelta: 0.005,
        }, 1000); // анимация за 1 сек
      }
    }, [locations]);

  const handleFinish = () => {
    const startTimestamp = Date.now() - time * 1000;

    const fullRoutePoints: RoutePoint[] = [
      {
        routeId: 0,
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
        pointType: 'start', // ← литерал
        timestamp: startTimestamp,
      },
      ...routePoints.map((point, i) => ({
        routeId: 0,
        latitude: point.latitude,
        longitude: point.longitude,
        pointType: 'path' as const, // ← ключевой момент
        timestamp: startTimestamp + (i + 1) * 30 * 1000,
      })),
      {
        routeId: 0,
        latitude: locations[locations.length - 1].latitude,
        longitude: locations[locations.length - 1].longitude,
        pointType: 'end' as const,
        timestamp: Date.now(),
      },
    ];

    router.push({
      pathname: '/savingARoute',
      params: {
        time: time.toString(),
        distance: distance.toString(),
        points: JSON.stringify(fullRoutePoints),
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={
          locations.length > 0
            ? {
              latitude: locations[0].latitude,
              longitude: locations[0].longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }
            : undefined
        }
      >
        {locations.length > 0 && (
          <>
            <Polyline coordinates={locations} strokeColor="#0000FF" strokeWidth={4} />
            <Marker coordinate={locations[0]} pinColor={'red'} title="Start" />
            <Marker
              coordinate={locations[locations.length - 1]}
              pinColor={'blue'}
              title="You are here"
            />
            {routePoints.map((point, index) => (
              <RouterMarker
                key={`point-${index}`}
                point={{
                  routeId: 0,
                  latitude: point.latitude,
                  longitude: point.longitude,
                  pointType: 'path', // здесь не важно
                  timestamp: Date.now(),
                }}
                color={'red'}
                number={index + 1}
              />
            ))}
          </>
        )}
      </MapView>

      <View style={styles.controls}>
        <GreenButton onPress={handleFinish}>
          <SText style={styles.btnText}>{l.btnFinishRoute}</SText>
        </GreenButton>
        <RouteTrackingPanel time={time} distance={distance} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
  },
  btnText: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default CreatingARoute;

// import React, { useState, useEffect, useRef } from 'react';
// import { View, StyleSheet } from 'react-native';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import { useRouter } from 'expo-router';
// import { useLocation } from '@/context/LocationContext';
// import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
// import GreenButton from '@/components/ui/GreenButton';
// import calculateDistance from '@/utils/calculateDistance';
// import SText from '@/components/ui/CustomFontText/SText';
// import { useLanguage } from '@/context/LanguageContext';
//
// const CreatingARoute = () => {
//   const { l } = useLanguage()
//   const router = useRouter();
//   const { locations, startTracking, stopTracking } = useLocation();
//   const [time, setTime] = useState(0);
//   const [distance, setDistance] = useState(0);
//   const mapRef = useRef<MapView>(null);
//
//   useEffect(() => {
//     startTracking();
//     const timer = setInterval(() => setTime(prev => prev + 1), 1000);
//     return () => {
//       stopTracking();
//       clearInterval(timer);
//     };
//   }, []);
//
//   useEffect(() => {
//     if (locations.length > 1) {
//       const newDistance = calculateDistance(locations);
//       setDistance(newDistance);
//
//       // Center map on current location when new points are added
//       if (mapRef.current && locations.length > 0) {
//         const lastLocation = locations[locations.length - 1];
//         mapRef.current.animateToRegion({
//           latitude: lastLocation.latitude,
//           longitude: lastLocation.longitude,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         });
//       }
//     }
//   }, [locations]);
//
//   const handleFinish = () => {
//     router.push({
//       pathname: '/savingARoute',
//       params: {
//         time: time.toString(),
//         distance: distance.toString(),
//       },
//     });
//   };
//
//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         showsUserLocation={true}
//         followsUserLocation={true}
//         showsMyLocationButton={true}
//         initialRegion={
//           locations.length > 0 ? {
//             latitude: locations[0].latitude,
//             longitude: locations[0].longitude,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005,
//           } : undefined
//         }
//       >
//         {locations.length > 0 && (
//           <>
//             <Polyline
//               coordinates={locations}
//               strokeColor="#0000FF"
//               strokeWidth={4}
//             />
//             <Marker
//               coordinate={locations[0]}
//               pinColor="green"
//               title="Start"
//             />
//             {locations.length > 1 && (
//               <Marker
//                 coordinate={locations[locations.length - 1]}
//                 pinColor="red"
//                 title="Current"
//               />
//             )}
//           </>
//         )}
//       </MapView>
//
//       <View style={styles.controls}>
//         <GreenButton onPress={handleFinish}>
//           <SText style={styles.btnText}>{l.btnFinishRoute}</SText>
//         </GreenButton>
//         <RouteTrackingPanel time={time} distance={distance} />
//       </View>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     paddingHorizontal: 18,
//   },
//   btnText: {
//     fontSize: 30,
//     textAlign: 'center',
//   },
// });
//
// export default CreatingARoute;
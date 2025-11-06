import { Route, RouteWithPoints } from '@/types/routes';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import SingleRouteMap from '@/components/route/SingleRouteMap';
import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

import { getAllRoutesWithPoints } from '@/services/routeRepository';

const MapScreen = () => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const { l } = useLanguage();
  const [routes, setRoutes] = useState<RouteWithPoints[]>([]);
  const [loading, setLoading] = useState(true);

  //  при открытии экрана
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const allRoutes = await getAllRoutesWithPoints();
        setRoutes(allRoutes);
      } catch (error) {
        console.error('Error loading routes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // отображение текущей позиции
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!routes) {
    return (
      <View style={styles.container}>
        <SText>{l.errorRoutesNotFound}</SText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.2,      // в 10 раз слабее приближение, чем стандартное 0.01
                longitudeDelta: 0.2,
              }
            : undefined
        }
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={true}
      >
        {routes.map((route, index) => {
          const color = getColorForIndex(index);
          return (
            <SingleRouteMap
              key={route.route.id ?? `route-${index}`}
              points={route.points}
              color={color}
              onPress={() => setCurrentRoute(route.route)}
            />
          );
        })}

        {/* Текущая позиция */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            pinColor="blue"
            title="You are here"
          />
        )}
      </MapView>

      {/* Title */}
      {currentRoute && (
        <View style={styles.infoPanel}>
          <Text style={styles.title}>{currentRoute.title}</Text>
          {currentRoute.description && (
            <Text style={styles.description}>{currentRoute.description}</Text>
          )}
        </View>
      )}
    </View>
  );
};

// Генерация разных цветов для маршрутов
const getColorForIndex = (index: number) => {
  const colors = [
    'tomato',
    'orange',
    'yellow',
    'green',
    'gold',
    'wheat',
    'linen',
    'tan',
    'aqua',
    'teal',
    'violet',
    'purple',
    'indigo',
    'turquoise',
    'navy',
    'plum',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    borderColor: colors.green.textBlock,
    borderWidth: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default MapScreen;

// import { Route, RouteWithPoints } from '@/types/routes';
//
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
//
// import SingleRouteMap from '@/components/route/SingleRouteMap';
// import SText from '@/components/ui/CustomFontText/SText';
// import { colors } from '@/constants/colors';
// import { useLanguage } from '@/context/LanguageContext';
//
// import { getAllRoutesWithPoints } from '@/services/routeRepository';
//
// const MapScreen = () => {
//   const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
//   const { l } = useLanguage();
//   const [routes, setRoutes] = useState<RouteWithPoints[]>([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const loadRoutes = async () => {
//       try {
//         const allRoutes = await getAllRoutesWithPoints();
//         setRoutes(allRoutes);
//       } catch (error) {
//         console.error('Error loading routes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     loadRoutes();
//   }, []);
//
//   // отображение текущей позиции
//   const [currentLocation, setCurrentLocation] =
//     useState<Location.LocationObject | null>(null);
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.warn('Permission to access location was denied');
//         return;
//       }
//
//       const location = await Location.getCurrentPositionAsync({});
//       setCurrentLocation(location);
//     })();
//   }, []);
//
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }
//
//   if (!routes) {
//     return (
//       <View style={styles.container}>
//         <SText>{l.errorRoutesNotFound}</SText>
//       </View>
//     );
//   }
//
//   return (
//     <View style={styles.container}>
//       <MapView style={styles.container}>
//         {routes.map((route, index) => {
//           const color = getColorForIndex(index);
//           return (
//             <TouchableOpacity
//               key={route.id}
//               onPress={() => setCurrentRoute(route)}
//             >
//               <SingleRouteMap points={route.points} color={color} />
//             </TouchableOpacity>
//           );
//         })}
//
//         {/* Текущая позиция */}
//         {currentLocation && (
//           <Marker
//             coordinate={{
//               latitude: currentLocation.coords.latitude,
//               longitude: currentLocation.coords.longitude,
//             }}
//             pinColor="blue"
//             title="You are here"
//           />
//         )}
//       </MapView>
//
//       {/* Title */}
//       {currentRoute && (
//         <View style={styles.infoPanel}>
//           <Text style={styles.title}>{currentRoute.title}</Text>
//           {currentRoute.description && (
//             <Text style={styles.description}>{currentRoute.description}</Text>
//           )}
//         </View>
//       )}
//     </View>
//   );
// };
//
// // Генерация разных цветов для маршрутов
// const getColorForIndex = (index: number) => {
//   const colors = [
//     'tomato',
//     'orange',
//     'yellow',
//     'green',
//     'gold',
//     'wheat',
//     'linen',
//     'tan',
//     'aqua',
//     'teal',
//     'violet',
//     'purple',
//     'indigo',
//     'turquoise',
//     'navy',
//     'plum',
//   ];
//   return colors[index % colors.length];
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   infoPanel: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     padding: 15,
//     borderRadius: 10,
//     elevation: 3,
//     backgroundColor: 'white',
//     borderColor: colors.green.textBlock,
//     borderWidth: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   description: {
//     fontSize: 14,
//     color: '#666',
//   },
// });
//
// export default MapScreen;

import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import formatTime from '@/utils/formatTime';
import RouteHeader from '@/components/route/RouteHeader';
import BorderedBlockInput from '@/components/ui/BorderedBlockInput';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { getRouteById, updateRoute, deleteRoute } from '@/services/routeRepository';
import { Route, RoutePoint } from '@/types/routes';
import EditRouteModal from '@/components/route/EditRouteModal';
import { useLanguage } from '@/context/LanguageContext';

const RouteDetails = () => {
  const { l } = useLanguage();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных маршрута
  useEffect(() => {
    loadRouteData();
  }, [id]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      const { route: loadedRoute, points: loadedPoints } = await getRouteById(Number(id));
      if (loadedRoute) {
        setRoute(loadedRoute);
        setPoints(loadedPoints);
      }
    } catch (error) {
      console.error('Error loading route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (title: string, description: string, travelTime: string) => {
    try {
      const updatedRoute = await updateRoute(Number(id), {
        ...route,
        title,
        description,
        travelTime: parseInt(travelTime) || 0,
      });
      setRoute(updatedRoute);
      setEditModalVisible(false);
      // Обновляем данные после сохранения
      await loadRouteData();
      Alert.alert(l.success, l.routeUpdated);
    } catch (error) {
      console.error(error);
      Alert.alert(l.error, l.errorUpdatingRoute);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      l.routeDeleting,
      l.confirmDeleting,
      [
        { text: l.btnCancel, style: 'cancel' },
        {
          text: l.btnDelete,
          onPress: async () => {
            try {
              await deleteRoute(Number(id));
              router.push('/');
            } catch (error) {
              console.error(error);
              Alert.alert(l.error, l.errorDeletingRoute);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SText>{l.loading}...</SText>
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
    <>
      <ScrollView>
        <RouteHeader
          routeLength={route.length ?? 0}
          routeTitle={route.title}
        />

        <BorderedBlockInput
          label={l.description}
          text={route.description || l.noDescription}
        />
        <BorderedBlockInput
          label={l.travelTime}
          text={formatTime(route.travelTime ?? 0)}
        />
        <BorderedBlockInput
          label={l.routeLength}
          text={`${route.length} ${l.inMeters}`}
        />

        <GreenButton
          onPress={() => router.push(`/route-map/${id}`)}
          style={styles.mapButton}
        >
          <View style={styles.buttonContainer}>
            <SText style={styles.mapButtonText}>{l.btnViewOnMap}</SText>
            <Image style={styles.buttonImage} source={icons.map} />
          </View>
        </GreenButton>

        <View style={styles.btnsContainer}>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Image style={styles.iconButton} source={icons.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Image style={styles.iconButton} source={icons.deleteIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditRouteModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSave}
        initialTitle={route.title}
        initialDescription={route.description || ''}
        initialTravelTime={route.travelTime?.toString() || ''}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  mapButton: {
    marginVertical: 20,
  },
  mapButtonText: {
    fontSize: 26,
    width: '50%',
    textAlign: 'center',
  },
  buttonImage: {
    tintColor: colors.black,
  },
  btnsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    height: 67,
  },
  btnText: {
    fontSize: 20,
    paddingHorizontal: 15,
  },
});

export default RouteDetails;


// import React, { useState, useEffect } from 'react';
// import {
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import MapView, { Polyline, Marker } from 'react-native-maps';
//
// import formatTime from '@/utils/formatTime';
// import RouteHeader from '@/components/route/RouteHeader';
// import BorderedBlockInput from '@/components/ui/BorderedBlockInput';
// import SText from '@/components/ui/CustomFontText/SText';
// import GreenButton from '@/components/ui/GreenButton';
// import { colors } from '@/constants/colors';
// import { icons } from '@/constants/icons';
// import { getRouteById, updateRoute, deleteRoute } from '@/services/routeRepository';
// import { Route, RoutePoint } from '@/types/routes';
// import EditRouteModal from '@/components/EditRouteModal';
//
// const RouteDetails = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();
//   const [route, setRoute] = useState<Route | null>(null);
//   const [points, setPoints] = useState<RoutePoint[]>([]);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//
//   // Загрузка данных маршрута
//   useEffect(() => {
//     loadRouteData();
//   }, [id]);
//
//   const loadRouteData = async () => {
//     try {
//       setLoading(true);
//       const { route: loadedRoute, points: loadedPoints } = await getRouteById(Number(id));
//       if (loadedRoute) {
//         setRoute(loadedRoute);
//         setPoints(loadedPoints);
//       }
//     } catch (error) {
//       console.error('Error loading route:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleSave = async (title: string, description: string, travelTime: string) => {
//     try {
//       const updatedRoute = await updateRoute(Number(id), {
//         ...route,
//         title,
//         description,
//         travelTime: parseInt(travelTime) || 0,
//       });
//       setRoute(updatedRoute);
//       setEditModalVisible(false);
//       // Обновляем данные после сохранения
//       await loadRouteData();
//       Alert.alert('Успех', 'Маршрут обновлен');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Ошибка', 'Не удалось обновить маршрут');
//     }
//   };
//
//   const handleDelete = async () => {
//     Alert.alert(
//       'Удаление маршрута',
//       'Вы уверены, что хотите удалить маршрут?',
//       [
//         { text: 'Отмена', style: 'cancel' },
//         {
//           text: 'Удалить',
//           onPress: async () => {
//             try {
//               await deleteRoute(Number(id));
//               router.push('/');
//             } catch (error) {
//               console.error(error);
//               Alert.alert('Ошибка', 'Не удалось удалить маршрут');
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };
//
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <SText>Загрузка...</SText>
//       </View>
//     );
//   }
//
//   if (!route) {
//     return (
//       <View style={styles.container}>
//         <SText>Маршрут не найден</SText>
//       </View>
//     );
//   }
//
//   return (
//     <>
//       <ScrollView>
//         <RouteHeader
//           routeLength={route.length ?? 0}
//           routeTitle={route.title}
//         />
//
//         <BorderedBlockInput
//           label="Описание"
//           text={route.description || 'Нет описания'}
//         />
//         <BorderedBlockInput
//           label="Время прохождения"
//           text={formatTime(route.travelTime ?? 0)}
//         />
//         <BorderedBlockInput
//           label="Длина маршрута"
//           text={`${route.length} метров`}
//         />
//
//         <GreenButton
//           onPress={() => router.push(`/route-map/${id}`)}
//           style={styles.mapButton}
//         >
//           <View style={styles.buttonContainer}>
//             <SText style={styles.mapButtonText}>Посмотреть на карте</SText>
//             <Image style={styles.buttonImage} source={icons.map} />
//           </View>
//         </GreenButton>
//
//         <View style={styles.btnsContainer}>
//           <TouchableOpacity onPress={() => setEditModalVisible(true)}>
//             <Image style={styles.iconButton} source={icons.editIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleDelete}>
//             <Image style={styles.iconButton} source={icons.deleteIcon} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//
//       <EditRouteModal
//         visible={editModalVisible}
//         onClose={() => setEditModalVisible(false)}
//         onSave={handleSave}
//         initialTitle={route.title}
//         initialDescription={route.description || ''}
//         initialTravelTime={route.travelTime?.toString() || ''}
//       />
//     </>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: 30,
//   },
//   mapButton: {
//     marginVertical: 20,
//   },
//   mapButtonText: {
//     fontSize: 26,
//     width: '50%',
//     textAlign: 'center',
//   },
//   buttonImage: {
//     tintColor: colors.black,
//   },
//   btnsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   iconButton: {
//     height: 67,
//   },
//   btnText: {
//     fontSize: 20,
//     paddingHorizontal: 15,
//   },
// });
//
// export default RouteDetails;
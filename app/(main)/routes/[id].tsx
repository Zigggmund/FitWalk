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
import MapView, { Polyline, Marker } from 'react-native-maps';

import formatTime from '@/utils/formatTime';
import RouteHeader from '@/components/route/RouteHeader';
import BorderedBlockInput from '@/components/ui/BorderedBlockInput';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { getRouteById, updateRoute, deleteRoute } from '@/services/routeRepository';
import { Route, RoutePoint } from '@/types/routes';

const RouteDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    travelTime: 0,
  });
  const [loading, setLoading] = useState(true);

  // Загрузка данных маршрута
  useEffect(() => {
    const loadRoute = async () => {
      try {
        const { route: loadedRoute, points: loadedPoints } = await getRouteById(Number(id));
        if (loadedRoute) {
          setRoute(loadedRoute);
          setPoints(loadedPoints);
          setFormData({
            title: loadedRoute.title,
            description: loadedRoute.description || '',
            travelTime: loadedRoute.travelTime || 0,
          });
        }
      } catch (error) {
        console.error('Error loading route:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [id]);

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Ошибка', 'Укажите название маршрута');
      return;
    }

    try {
      const updatedRoute = await updateRoute(Number(id), {
        ...route,
        ...formData,
      });
      setRoute(updatedRoute);
      setIsEditing(false);
      Alert.alert('Успех', 'Маршрут обновлен');
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось обновить маршрут');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Удаление маршрута',
      'Вы уверены, что хотите удалить маршрут?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          onPress: async () => {
            try {
              await deleteRoute(Number(id));
              router.push('/');
            } catch (error) {
              console.error(error);
              Alert.alert('Ошибка', 'Не удалось удалить маршрут');
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
        <SText>Загрузка...</SText>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.container}>
        <SText>Маршрут не найден</SText>
      </View>
    );
  }

  return (
    <ScrollView>
      <RouteHeader
        routeLength={route.length ?? 0}
        routeTitle={isEditing ? formData.title : route.title}
      />

      {isEditing ? (
        <>
          <BorderedBlockInput
            label="Название"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
            editable
          />
          <BorderedBlockInput
            label="Описание"
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            editable
            multiline
          />
          <BorderedBlockInput
            label="Время прохождения (минуты)"
            value={formData.travelTime.toString()}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              setFormData({...formData, travelTime: num});
            }}
            editable
            keyboardType="numeric"
          />
        </>
      ) : (
        <>
          <BorderedBlockInput
            label="Описание"
            text={route.description || 'Нет описания'}
          />
          <BorderedBlockInput
            label="Время прохождения"
            text={formatTime(route.travelTime ?? 0)}
          />
        </>
      )}

      <BorderedBlockInput
        label="Длина маршрута"
        text={`${route.length} метров`}
      />

      <GreenButton
        onPress={() => router.push(`/route-map/${id}`)}
        style={styles.mapButton}
      >
        <View style={styles.buttonContainer}>
          <SText style={styles.mapButtonText}>Посмотреть на карте</SText>
          <Image style={styles.buttonImage} source={icons.map} />
        </View>
      </GreenButton>

      <View style={styles.btnsContainer}>
        {isEditing ? (
          <>
            <GreenButton onPress={handleUpdate} small>
              <SText style={styles.btnText}>Подтвердить</SText>
            </GreenButton>
            <GreenButton
              onPress={() => setIsEditing(false)}
              small
              color={colors.gray}
            >
              <SText style={styles.btnText}>Отмена</SText>
            </GreenButton>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Image style={styles.iconButton} source={icons.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Image style={styles.iconButton} source={icons.deleteIcon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
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
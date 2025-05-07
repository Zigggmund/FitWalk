import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import CompositeInput from '@/components/ui/CompositeInput';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import PageHeader from '@/components/ui/PageHeader';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useLocation } from '@/hooks/LocationContext';
import { RoutePoint} from '@/types/routes';

import { insertRoute, addRoutePoints } from '@/services/routeRepository';

const SavingARoute = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { locations, clearLocations } = useLocation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [travelTime, setTravelTime] = useState(
    params.time ? `${Math.floor(Number(params.time) / 60)}` : '0',
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Укажите название маршрута');
      return;
    }
    const numValue = parseInt(travelTime, 10);
    if (isNaN(numValue)) {
      Alert.alert('Ошибка', 'Время должно быть числом');
      return;
    }
    if (numValue <= 0) {
      Alert.alert('Ошибка', 'Время должно быть больше 0');
      return false;
    }
    console.log(numValue)
    console.log(travelTime)
    console.log(name)
    console.log(description)
    console.log()

    try {
      // Сохраняем маршрут
      const routeId = await insertRoute({
        title: name,
        description: description.trim(),
        travelTime: Number(params.time),
        length: 1000, // Number(params.distance),
      });

      // Сохраняем точки с явным указанием типа
      const points: RoutePoint[] = locations.map((loc, i) => ({
        routeId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        pointType: (
          i === 0 ? 'start' :
            i === locations.length - 1 ? 'end' : 'path'
        ) as 'start' | 'end' | 'path', // Явное приведение типа
        timestamp: Math.floor(Date.now() / 1000),
      }));

      await addRoutePoints(points);

      clearLocations();
      Alert.alert('Успех', 'Маршрут сохранен');
      router.push('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось сохранить маршрут');
    }
  };

  return (
    <ScrollView>
      <PageHeader text={'Создание маршрута'} />
      <CompositeInput
        label={'Название'}
        isSmall={true}
        value={name}
        onChangeText={setName}
      />
      <CompositeInput
        label={'Описание'}
        isSmall={true}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <CompositeInput
        label={'Время прохождения (минуты)'}
        isSmall={true}
        value={travelTime}
        onChangeText={setTravelTime}
      />
      <CompositeInput
        label={'Длина маршрута (метры)'}
        value={`${params.distance || 0}`}
        disable
        isSmall={true}
      />

      <GreenButton onPress={() => routeId && router.push(`/route-details?routeId=${routeId}`)}>
        <View style={styles.buttonContainer}>
          <SText style={styles.mapButtonText}>Посмотреть маршрут</SText>
          <Image style={styles.buttonImage} source={icons.map} />
        </View>
      </GreenButton>

      <View style={[styles.buttonContainer, { paddingRight: 30 }]}>
        <GreenButton onPress={handleSave}>
          <SText style={styles.saveButtonText}>Сохранить</SText>
        </GreenButton>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Удаление маршрута', 'Весь прогресс будет потерян', [
              {
                text: 'Удалить',
                onPress: () => {
                  clearLocations();
                  router.push('/');
                },
              },
              { text: 'Отмена' },
            ])
          }
        >
          <Image style={styles.delete} source={icons.deleteIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
  },
  mapButtonText: {
    fontSize: 26,
    width: '50%',
    textAlign: 'center',
  },
  buttonImage: {
    tintColor: colors.black,
  },

  saveButtonText: {
    fontSize: 26,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  delete: {
    height: 67,
  },
});

export default SavingARoute;

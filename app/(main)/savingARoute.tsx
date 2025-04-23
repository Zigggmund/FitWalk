import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import CompositeInput from '@/components/ui/CompositeInput';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import PageHeader from '@/components/ui/PageHeader';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { routes } from '@/constants/routes';

const SavingARoute = () => {
  const route = routes[0];
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // менять поле
  const [travelTime, setTravelTime] = useState(
    `${route.travelTime.toString()} минут`,
  );

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
      />
      <CompositeInput
        label={'Время прохождения'}
        value={travelTime}
        onChangeText={setTravelTime}
        isSmall={true}
      />
      <CompositeInput
        label={'Длина маршрута'}
        value={`${route.length} метров`}
        disable
        isSmall={true}
      />
      <GreenButton onPress={() => router.push('/map')}>
        <View style={styles.buttonContainer}>
          <SText style={styles.mapButtonText}>Посмотреть на карте</SText>
          <Image style={styles.buttonImage} source={icons.map} />
        </View>
      </GreenButton>

      <View style={[styles.buttonContainer, { paddingRight: 30 }]}>
        <GreenButton onPress={() => router.push('/')}>
          <SText style={styles.saveButtonText}>Сохранить</SText>
        </GreenButton>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Удаление маршрута',
              'Вы уверены, что хотите удалить маршрут?',
              [
                {
                  text: 'Отмена',
                  style: 'cancel',
                },
                {
                  text: 'Удалить',
                  onPress: () => {
                    router.push('/'); // переход на главную страницу
                  },
                  style: 'destructive',
                },
              ],
              { cancelable: true },
            );
          }}
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

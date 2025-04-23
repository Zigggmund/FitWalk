import React from 'react';
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
import { routes } from '@/constants/routes';

const RouteDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const route = routes.find(route => route.id == Number(id));

  if (!route) {
    return <SText>404</SText>;
  }

  return (
    <ScrollView>
      <RouteHeader routeLength={route.length} routeTitle={route.title} />

      <BorderedBlockInput label={'Описание'} text={'Просто описание'} />
      {/*<BorderedBlockInput label={'Описание'} text={route.description} />*/}
      <BorderedBlockInput
        label={'Время прохождения'}
        text={formatTime(route.travelTime)}
      />
      <BorderedBlockInput
        label={'Длина маршрута'}
        text={`${route.length} метров`}
      />

      <GreenButton onPress={() => router.push('/map')}>
        <View style={styles.buttonContainer}>
          <SText style={styles.mapButtonText}>Посмотреть на карте</SText>
          <Image style={styles.buttonImage} source={icons.map} />
        </View>
      </GreenButton>

      <View style={styles.btnsContainer}>
        <TouchableOpacity>
          <Image style={styles.iconButton} source={icons.editIcon} />
        </TouchableOpacity>
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
          <Image style={styles.iconButton} source={icons.deleteIcon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formDescription: {
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
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

  btnsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    height: 67,
  },
});

export default RouteDetails;

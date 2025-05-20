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
import { useLocation } from '@/context/LocationContext';
import { RoutePoint} from '@/types/routes';

import { insertRoute, addRoutePoints } from '@/services/routeRepository';
import { useLanguage } from '@/context/LanguageContext';

const SavingARoute = () => {
  const { l } = useLanguage();
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
      Alert.alert(l.error, l.validationName);
      return;
    }
    const numValue = parseInt(travelTime, 10);
    if (isNaN(numValue)) {
      Alert.alert(l.error, l.validationTimeIsNumber);
      return;
    }
    if (numValue <= 0) {
      Alert.alert(l.error, l.validationTimeIsPositive);
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
      Alert.alert(l.success, l.routeSaved);
      router.push('/');
    } catch (error) {
      console.error(error);
      Alert.alert(l.error, l.errorSaveRoute);
    }
  };

  return (
    <ScrollView>
      <View style={{marginTop: 20}}>
        <PageHeader text={l.routeCreation} />
      </View>
      <CompositeInput
        label={l.name}
        isSmall={true}
        value={name}
        onChangeText={setName}
      />
      <CompositeInput
        label={l.description}
        isSmall={true}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <CompositeInput
        label={l.travelTimeMinutes}
        isSmall={true}
        value={travelTime}
        onChangeText={setTravelTime}
      />
      <CompositeInput
        label={l.routeLengthMeters}
        value={`${params.distance || 0}`}
        disable
        isSmall={true}
      />

      <GreenButton onPress={() => routeId && router.push(`/routes/map/${routeId}`)}>
        <View style={styles.buttonContainer}>
          <SText style={styles.mapButtonText}>{l.btnViewRoute}</SText>
          <Image style={styles.buttonImage} source={icons.map} />
        </View>
      </GreenButton>

      <View style={[styles.buttonContainer, { paddingRight: 30 }]}>
        <GreenButton onPress={handleSave}>
          <SText style={styles.saveButtonText}>{l.btnSave}</SText>
        </GreenButton>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(l.routeDeleting, l.progressLost, [
              {
                text: l.btnDelete,
                onPress: () => {
                  clearLocations();
                  router.push('/');
                },
              },
              { text: l.btnCancel },
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

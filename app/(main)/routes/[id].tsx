import { Route, RoutePoint } from '@/types/routes';

import React, { useEffect, useState } from 'react';
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

import EditRouteModal from '@/components/route/EditRouteModal';
import RouteHeader from '@/components/route/RouteHeader';
import BorderedBlockInput from '@/components/ui/BorderedBlockInput';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';
import { useLanguage } from '@/context/LanguageContext';

import {
  deleteRoute,
  getRouteById,
  updateRoute,
} from '@/services/routeRepository';

const RouteDetails = () => {
  const { l } = useLanguage();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [route, setRoute] = useState<Route | null>(null);
  const [, setPoints] = useState<RoutePoint[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных маршрута
  useEffect(() => {
    loadRouteData();
  }, [id]);

  const loadRouteData = async () => {
    try {
      setLoading(true);
      const { route: loadedRoute, points: loadedPoints } = await getRouteById(
        Number(id),
      );
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

  const handleSave = async (
    title: string,
    description: string,
    travelTime: string,
  ) => {
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
      { cancelable: true },
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
          routeTitle={route.title ?? ''}
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
          text={`${route.length} ${l.meter}`}
        />

        <GreenButton onPress={() => router.push(`/routes/map/${id}`)}>
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

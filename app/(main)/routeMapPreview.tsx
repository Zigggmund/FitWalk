import { RoutePoint } from '@/types/routes';

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';

import SingleRouteMap from '@/components/route/SingleRouteMap';
import { useLanguage } from '@/context/LanguageContext';

import { calculateRegion } from '@/utils/calculateRegion';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';

const RouteMapPreview = () => {
  const { l } = useLanguage();
  const params = useLocalSearchParams();
  const [points, setPoints] = useState<RoutePoint[]>();
  const router = useRouter();

  useEffect(() => {
      try {
        if (typeof params.points === 'string') {
          const parsed = JSON.parse(params.points);
          if (Array.isArray(parsed)) {
            setPoints(parsed);
          } else {
            throw new Error('Points are invalid');
          }
        } else {
          throw new Error('Points param is not a string');
        }
      } catch (e) {
        console.error('Error parsing route points:', e);
        setPoints(undefined);
      }
  }, []);

  if (!points) {
    return (
      <View style={styles.container}>
        <SText>{l.errorRouteNotFound}</SText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.container}
        initialRegion={calculateRegion(points)}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <SingleRouteMap points={points} />
      </MapView>

      <View style={styles.infoPanel}>
        <GreenButton onPress={() => router.back()}>
          <SText style={styles.btnText}>{l.btnFinishViewing}</SText>
        </GreenButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
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
  btnText: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default RouteMapPreview;

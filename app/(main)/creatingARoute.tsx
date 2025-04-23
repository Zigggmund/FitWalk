import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import RouteTrackingPanel from '@/components/route/RouteTrackingPanel';
import SText from '@/components/ui/CustomFontText/SText';
import GreenButton from '@/components/ui/GreenButton';
import { images } from '@/constants/images';

const CreatingARoute = () => {
  const router = useRouter();

  return (
    <ImageBackground style={styles.container} source={images.mapRoute}>
      <View style={[styles.container, styles.flexContainer]}>
        <GreenButton onPress={() => router.push('/savingARoute')}>
          <SText style={styles.btnText}>Завершить маршрут</SText>
        </GreenButton>
        <RouteTrackingPanel />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  btnText: {
    fontSize: 30,
    textAlign: 'center',
    paddingVertical: -5,
  },
});

export default CreatingARoute;

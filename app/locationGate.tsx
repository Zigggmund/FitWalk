import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLocation } from '@/context/LocationContext';
import { useLanguage } from '@/context/LanguageContext';

const LocationGate = ({ children }: { children: React.ReactNode }) => {
  const { permissionGranted, retryRequest } = useLocation();
  const { l } = useLanguage();

  if (!permissionGranted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>{l.errorUnableToWorkWithoutGeo}</Text>
        <Button title={l.btnTryAgain} onPress={retryRequest} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

export default LocationGate

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import LoadingScreen from './loading';

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#67BCB2');
  }, []);

  // Когда приложение готово, показываем основной экран
  return (
    <SafeAreaProvider>
      {!isAppReady ? (
        <LoadingScreen onPress={() => setIsAppReady(true)} />
      ) : (
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor="#67BCB2" // Цвет для верхней панели
          />
          <Slot />
        </View>
      )}
    </SafeAreaProvider>
  );
}

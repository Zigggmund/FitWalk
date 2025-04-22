import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import LoadingScreen from './loading';

// Используем import, но загружаем через Asset.fromModule
import SensationFont from '@/assets/fonts/Sansation-Regular.ttf';

// для шрифта
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Загрузка шрифта
  useEffect(() => {
    const load = async () => {
      try {
        console.log('Загрузка шрифта...');
        const asset = Asset.fromModule(SensationFont);
        await Font.loadAsync({
          Sensation: asset.uri, // Передаем URI для шрифта
        });
        console.log('Шрифт загружен');
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Ошибка при загрузке шрифта', error);
      }
    };
    load();
  }, []); // Этот useEffect вызывается только один раз при монтировании компонента

  useEffect(() => {
    if (fontsLoaded) {
      NavigationBar.setBackgroundColorAsync('#67BCB2');
    }
  }, [fontsLoaded]); // Убедись, что NavigationBar изменяется только после загрузки шрифта

  if (!fontsLoaded || !isAppReady) {
    return <LoadingScreen onPress={() => setIsAppReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#67BCB2" />
        <Slot />
      </View>
    </SafeAreaProvider>
  );
}

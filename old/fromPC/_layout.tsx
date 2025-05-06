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

import SensationFont from '@/assets/fonts/Sansation-Regular.ttf';
import { checkDatabase, initDatabase } from '@/services/db';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        // Загрузка шрифта
        console.log('Загрузка шрифта...');
        const asset = Asset.fromModule(SensationFont);
        await Font.loadAsync({ Sensation: asset.uri });
        setFontsLoaded(true);

        // Инициализация БД
        console.log('Инициализация базы данных...');
        await initDatabase();
        await checkDatabase();
        setDbInitialized(true);

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Ошибка при загрузке ресурсов', error);
      } finally {
        setIsAppReady(true);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      NavigationBar.setBackgroundColorAsync('#67BCB2');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isAppReady || !dbInitialized) {
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
};

export default RootLayout;

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { LanguageProvider } from '@/context/LanguageContext';
import { LocationProvider } from '@/context/LocationContext';

import LoadingScreen from './loading';

import { LocationGate } from '@/app/locationGate';
import SensationFont from '@/assets/fonts/Sansation-Regular.ttf';
import { checkDatabase, initDatabase } from '@/services/db';
import { getSetting, setSetting } from '@/services/settingsRepository';

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
        // проверка данных
        // console.log('МАРШРУТЫ', await getAllRoutes());
        // console.log('ЯЗЫК', await getSetting('language'));

        // 💡 Проверка разрешения на геолокацию
        const permissionRequested = await getSetting<boolean>(
          'location_permission_requested',
        );
        if (!permissionRequested) {
          console.log('Запрос разрешения на геолокацию...');
          const { status } = await Location.requestForegroundPermissionsAsync();
          await setSetting('location_permission_requested', 'true');

          if (status !== 'granted') {
            console.warn('Разрешение на геолокацию не получено');
          } else {
            console.log('Геолокация разрешена');
          }
        }

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Ошибка при загрузке ресурсов', error);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      NavigationBar.setBackgroundColorAsync('#67BCB2');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !dbInitialized || !isAppReady) {
    // Здесь уже есть язык → можно показывать LoadingScreen
    return <LoadingScreen onPress={() => setIsAppReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <LocationProvider>
          <LocationGate>
            <View style={{ flex: 1 }}>
              <StatusBar backgroundColor="#67BCB2" />
              <Slot />
            </View>
          </LocationGate>
        </LocationProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;

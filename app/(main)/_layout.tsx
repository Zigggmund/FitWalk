import React from 'react';
import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';

import CustomFooter from '@/components/layout/CustomFooter'; // если он у тебя есть
import CustomHeader from '@/components/layout/CustomHeader';

export default function MainLayout() {
  // для сокрытия на время создания маршрута
  const hideLayout = ['/savingARoute', '/routeMapPreview'].includes(usePathname());

  return (
    <View style={{ flex: 1 }}>
      {!hideLayout && <CustomHeader />}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      {!hideLayout && <CustomFooter />}
    </View>
  );
}

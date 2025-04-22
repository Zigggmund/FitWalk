import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';

import CustomFooter from '@/components/layout/CustomFooter'; // если он у тебя есть
import CustomHeader from '@/components/layout/CustomHeader';

export default function MainLayout() {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <CustomFooter />
    </View>
  );
}

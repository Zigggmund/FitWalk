// components/CustomHeader.tsx
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { icons } from '@/constants/icons'; // или куда ты положил иконку

export default function CustomHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('./../settings')}
        style={styles.iconWrapper}
      >
        <Image
          source={icons.settings}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#67BCB2',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingBottom: 10,
  },
  iconWrapper: {
    padding: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
});

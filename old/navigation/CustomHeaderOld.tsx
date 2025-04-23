import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

import { icons } from '@/constants/icons'; // твои иконки

// Массив иконок для хедера
const headerTabs = [
  { name: 'creatingARoute', icon: icons.startRoute, height: 50 },
  { name: 'settings', icon: icons.settings, height: 40 },
] as const;

export default function CustomHeader() {
  const router = useRouter();
  const segments = useSegments(); // ['(main)', '(headerTabs)', 'map'] и т.п.

  return (
    <View style={styles.container}>
      {headerTabs.map((tab, index) => {
        const focused = segments[1] === tab.name;
        return (
          
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!focused) {
                router.push(`/(main)/${tab.name}`);
              }
            }}
          >
            <Image
              source={tab.icon}
              style={{
                height: tab.height,
                tintColor: focused ? '#000' : '#fff',
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#67BCB2',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',

    paddingTop: 30,
    paddingRight: 20,
    paddingLeft: 10,
  },
  iconWrapper: {
    padding: 5,
    marginHorizontal: 8,
  },
});

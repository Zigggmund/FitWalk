import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

import { icons } from '@/constants/icons';
import { useLanguage } from '@/context/LanguageContext'; // твои иконки

export default function CustomHeader() {
  const router = useRouter();
  const segments = useSegments();
  const { language } = useLanguage();

  const headerTabs = [
    { name: 'creatingARoute', height: 50 },
    { name: 'settings', height: 40 },
  ] as const;

  return (
    <View style={styles.container}>
      {headerTabs.map(tab => {
        const focused = segments[1] === tab.name;

        // Выбор иконки прямо внутри JSX — важно
        const iconSource =
          tab.name === 'creatingARoute'
            ? language === 'ru'
              ? icons.startRoute_ru
              : icons.startRoute_en
            : icons.settings;

        return (
          <TouchableOpacity
            key={`${language}-${tab.name}`} // важно, чтобы заставить React пересоздать
            onPress={() => {
              if (!focused) {
                router.push(`/(main)/${tab.name}`);
              }
            }}
          >
            <Image
              key={`img-${language}-${tab.name}`} // меняем key у самого Image
              source={iconSource}
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

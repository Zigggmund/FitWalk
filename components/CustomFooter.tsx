import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

import { icons } from '@/constants/icons';

const tabs = [
  { name: 'map', icon: icons.map, size: 50 },
  { name: '', icon: icons.home, size: 80 },
  { name: 'weather', icon: icons.weather, size: 60 },
] as const;

export default function CustomFooter() {
  const router = useRouter();
  const segments = useSegments(); // ['(main)', '(tabs)', 'map'] и т.п.

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        // для учета выделения footer
        const isInTabs = segments[1] === '(tabs)';
        const currentTab = isInTabs ? (segments[2] ?? '') : null;
        const focused = currentTab === tab.name;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!focused) {
                const route = tab.name
                  ? `/(main)/(tabs)/${tab.name}`
                  : '/(main)/(tabs)';
                router.push(route as never);
              }
            }}
          >
            <Image
              source={tab.icon}
              style={{
                height: tab.size,
                width: tab.size,
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
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#67BCB2',
  },
});

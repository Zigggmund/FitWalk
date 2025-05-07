import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

import { icons } from '@/constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { name: 'map', icon: icons.map, size: 50 },
  { name: '', icon: icons.home, size: 80 },
  { name: 'weather', icon: icons.weather, size: 60 },
] as const;

export default function CustomFooter() {
  const router = useRouter();
  const segments = useSegments(); // ['(main)', '(tabs)', 'map'] и т.п.
  const insets = useSafeAreaInsets()

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: insets.bottom,
        backgroundColor: '#67BCB2',
      }
    ]}>
      {tabs.map((tab, index) => {
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
            style={styles.tabButton}
          >
            <Image
              source={tab.icon}
              style={{
                height: tab.size,
                width: tab.size,
                tintColor: focused ? '#000' : '#fff',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
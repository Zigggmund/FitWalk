import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import { icons } from '@/constants/icons';

const tabs = [
  { name: '/(main)/(tabs)/map', icon: icons.map, size: 50 },
  { name: '/(main)/(tabs)/index', icon: icons.home, size: 80 },
  { name: '/(main)/(tabs)/weather', icon: icons.weather, size: 60 },
] as const;

export default function CustomFooter() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const focused = pathname.includes(tab.name);
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!focused) {
                router.push(tab.name);
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
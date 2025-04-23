import { Route } from '@/types/routes';

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors'; // импорт цветов

type RouteItemProps = {
  route: Route;
  isMainPage?: boolean;
};

const RouteItem = ({ route, isMainPage = true }: RouteItemProps) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.block,
        pressed && { opacity: 0.6 }, // если элемент нажат, применяем стиль pressed
      ]}
      onPress={() =>
        router.push(
          isMainPage ? `/routes/${route.id}` : `/routes/weather/${route.id}`,
        )
      }
    >
      <SText style={styles.text}>{route.title}</SText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  block: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 20,
    paddingBottom: 16,
    margin: 12,
    backgroundColor: colors.dark.primary,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 20,
  },
  text: {
    color: colors.white,
    fontSize: 26,
    textAlign: 'center',
    flex: 1, // Занимает всю доступную ширину
  },
});

export default RouteItem;

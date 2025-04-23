import { Route } from '@/types/routes'; // импорт цветов

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';

type RouteItemProps = {
  route: Route;
  isMainPage?: boolean;
};

const RouteItemOld = ({ route, isMainPage = true }: RouteItemProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = () => {
    if (isLoading) return; // Не даем переходить, пока идет переход
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false); // Разрешаем переходы после задержки
    }, 500); // Это 500мс - ты можешь подстроить под свои нужды
  };

  return (
    <Link
      href={isMainPage ? `/routes/${route.id}` : `/routes/weather/${route.id}`}
      asChild
      style={styles.block}
    >
      <Pressable onPress={handlePress}>
        <SText style={styles.text}>{route.title}</SText>
      </Pressable>
    </Link>
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

export default RouteItemOld;

import { Route } from '@/types/routes';

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';

type RouteItemProps = {
  route: Route;
  isMainPage?: boolean;
};

const RouteItem = ({ route, isMainPage = true }: RouteItemProps) => {
  return (
    <Link
      href={isMainPage ? `/routes/${route.id}` : `/routes/${route.id}-weather`}
      asChild
    >
      <TouchableOpacity>
        <View className={'p-2 mb-2 color-dark-primary'}>
          <SText className={'color-white'}>{route.title}</SText>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default RouteItem;

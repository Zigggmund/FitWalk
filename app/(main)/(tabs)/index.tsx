import React from 'react';
import { FlatList, View } from 'react-native';

import RouteItem from '@/components/route/RouteItem';
import PageHeader from '@/components/ui/PageHeader';
import Line from '@/components/ui/parts/Line';
import { routes } from '@/constants/routes';

export default function Index() {
  return (
    <View>
      <View>
        <PageHeader text={'Ваши маршруты:'} />
      </View>
      <FlatList
        data={routes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RouteItem route={item} />}
        ItemSeparatorComponent={Line} // Используем Line как разделитель
      />
    </View>
  );
}

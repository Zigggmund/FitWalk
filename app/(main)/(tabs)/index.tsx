import React from 'react';
import { FlatList, View } from 'react-native';

import RouteItem from '@/components/RouteItem';
import BorderedInput from '@/components/ui/BorderedInput';
import GreenButton from '@/components/ui/GreenButton';
import PageHeader from '@/components/ui/PageHeader';
import RouteHeader from '@/components/ui/RouteHeader';
import { routes } from '@/constants/routes';

export default function Index() {
  return (
    <View>
      <View>
        <RouteHeader />
        <PageHeader />
        <GreenButton />
        <BorderedInput />
      </View>
      <FlatList
        data={routes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RouteItem route={item} />}
      />
    </View>
  );
}

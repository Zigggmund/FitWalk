import React from 'react';
import { View } from 'react-native';
import SText from '@/components/ui/CustomFontText/SText';
import { useLocalSearchParams } from 'expo-router';

const RouteDetails = () => {
  const { id } = useLocalSearchParams()

  return (
    <View>
      <SText>
        route{id}
      </SText>
    </View>
  );
};

export default RouteDetails;
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SText from '@/components/ui/CustomFontText/SText';

const RouteHeader = () => {
  return (
    <View>
      <TouchableOpacity>
        <SText className={'color-white'}>RouteHeader</SText>
      </TouchableOpacity>
    </View>
  );
};

export default RouteHeader;

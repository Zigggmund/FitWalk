import React from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import { Tabs } from 'expo-router';

import CustomHeader from '@/components/CustomHeader';
import { icons } from '@/constants/icons';

interface TabIconProps {
  focused: boolean;
  icon: ImageSourcePropType | undefined;
  width: number;
  height: number;
}

const TabIcon = ({ focused, icon, width, height }: TabIconProps) => {
  const iconStyle = {
    height: height,
    width: width,
    tintColor: focused ? '#000' : '#fff',
  };
  return (
    <View
      style={{ paddingTop: 40 }}
      className={'size-full justify-center items-center'}
    >
      <Image source={icon} style={iconStyle} />
    </View>
  );
};

const _Layout = () => {
  return (
    <>
      <CustomHeader />

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#67BCB2',
            height: 80,
            overflow: 'hidden',
          },
          headerStyle: {
            backgroundColor: '#67BCB2',
          },
        }}
      >
        <Tabs.Screen
          name={'(tabs)/map'}
          options={{
            title: 'Map',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.map}
                height={50}
                width={50}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={'(tabs)/index'}
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.home}
                height={80}
                width={80}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={'(tabs)/weather'}
          options={{
            title: 'Weather',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.weather}
                height={60}
                width={60}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _Layout;
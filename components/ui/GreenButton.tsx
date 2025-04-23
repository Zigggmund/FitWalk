import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';

type PageHeaderProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

const GreenButton = ({ children, onPress }: PageHeaderProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button]}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 18,
    paddingBottom: 14,
    marginTop: 12,
    marginBottom: 20,
    marginHorizontal: 12,
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: colors.green.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default GreenButton;

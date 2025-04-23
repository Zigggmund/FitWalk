import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

const Line = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 10,
    backgroundColor: colors.green.primary,
  },
});

export default Line;

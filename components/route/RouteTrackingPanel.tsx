import React from 'react';
import { StyleSheet, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';

const RouteTrackingPanel = () => {
  return (
    <View style={styles.container}>
      <View style={styles.internalContainer}>
        <SText style={styles.text}>Время:</SText>
        <View style={styles.valueContainer}>
          <SText style={styles.text}>0 : 00</SText>
          <View style={styles.underline} />
        </View>
      </View>
      <View style={styles.internalContainer}>
        <SText style={styles.text}>Дистанция:</SText>
        <View style={styles.valueContainer}>
          <SText style={styles.text}>0 м</SText>
          <View style={styles.underline} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.green.textBlock,
    borderRadius: 20,
    borderWidth: 1,
  },
  internalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
  },
  valueContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  underline: {
    height: 1,
    width: 100, // или подбери под макет
    backgroundColor: colors.black,
  },
});

export default RouteTrackingPanel;

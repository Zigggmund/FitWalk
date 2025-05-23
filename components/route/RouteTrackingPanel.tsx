import React from 'react';
import { StyleSheet, View } from 'react-native';
import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  time: number; // В секундах
  distance: number; // В метрах
}

const RouteTrackingPanel = ({ time, distance }: Props) => {
  const { l } = useLanguage()
  const formatTime = () => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins} : ${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.internalContainer}>
        <SText style={styles.text}>{l.time}:</SText>
        <View style={styles.valueContainer}>
          <SText style={styles.text}>{formatTime()}</SText>
          <View style={styles.underline} />
        </View>
      </View>
      <View style={styles.internalContainer}>
        <SText style={styles.text}>{l.distance}:</SText>
        <View style={styles.valueContainer}>
          <SText style={styles.text}>{distance} м</SText>
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

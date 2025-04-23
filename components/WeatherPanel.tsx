import { Image, StyleSheet, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';
import { icons } from '@/constants/icons';

type WeatherPanelProps = {
  temperature: number;
  wind: number;
  weatherType: string; // Тип погоды, например 'sunny', 'cloudy', 'windy', и т.д.
};

const getIcon = (weatherType: string) => {
  switch (weatherType) {
    case 'clear':
      return icons.weatherSunny;
    case 'clouds':
      return icons.weatherCloudy;
    case 'thunder':
      return icons.weatherThunder;
    case 'snow':
      return icons.weatherSnowy;
    case 'rain':
      return icons.weatherRainy;
    default:
      // Если тип погоды не определён, ставим солнечную иконку по умолчанию
      return icons.weatherSunny;
  }
};

export const WeatherPanel = ({
  temperature,
  wind,
  weatherType,
}: WeatherPanelProps) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.windContainer}>
        {wind > 10 && (
          <Image source={icons.weatherWindy} style={styles.windIcon} />
        )}
        <View style={styles.windLineBreak}>
          <SText style={styles.windText}>Ветер</SText>
          <SText style={styles.windText}>{wind}м/с</SText>
        </View>
      </View>
      <SText style={styles.temperature}>{temperature}°C</SText>
      <Image source={getIcon(weatherType)} style={styles.weatherIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.green.textBlock,
  },
  windText: {
    fontSize: 24,
  },
  windIcon: {
    width: 32,
    height: 32,
    marginRight: 5,
  },
  windContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  windLineBreak: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 44,
  },
  weatherIcon: {
    width: 55,
  },
});

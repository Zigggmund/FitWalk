import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';
import { images } from '@/constants/images';

interface LoadingScreenProps {
  onPress: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onPress }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <View style={styles.label}>
          <SText style={styles.text}>Welcome!</SText>
        </View>
      </TouchableOpacity>
      <Image source={images.welcome} style={styles.image} resizeMode="cover" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  label: {
    borderWidth: 3,
    borderRadius: 20,
    borderColor: colors.black,
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.green.textBlock, // Пример фона для текста
  },
  text: {
    fontSize: 32,
  },
  wrapper: {
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});

export default LoadingScreen;

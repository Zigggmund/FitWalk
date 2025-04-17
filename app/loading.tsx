import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { images } from '@/constants/images';

interface LoadingScreenProps {
  onPress: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.wrapper}>
        <View style={styles.label}>
          <Text style={styles.text}>Приветствуем!</Text>
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
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#67BCB2', // Пример фона для текста
  },
  text: {
    color: 'white',
    fontSize: 22,
  },
  wrapper: {
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
});

export default LoadingScreen;

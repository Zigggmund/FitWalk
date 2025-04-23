import { StyleSheet, TextInput, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import InputWrapperBlock from '@/components/ui/parts/InputWrapperBlock';
import { colors } from '@/constants/colors';

interface CompositeInputProps {
  label: string;
  value?: string;
  onChangeText?: (value: string) => void;
  disable?: boolean;
  multiline?: boolean;
  isSmall?: boolean;
}

const CompositeInput = ({
  label,
  value,
  onChangeText,
  disable,
  multiline = false,
  isSmall = false,
}: CompositeInputProps) => {
  return (
    <InputWrapperBlock>
      <View style={styles.container}>
        <SText
          style={[styles.label, isSmall ? { fontSize: 20 } : { fontSize: 26 }]}
        >
          {label}:
        </SText>
        <View style={styles.valueWrapper}>
          {!disable ? (
            <TextInput
              style={styles.text}
              value={value}
              onChangeText={onChangeText}
              editable={true}
              multiline={multiline}
            />
          ) : (
            <SText style={[styles.text, { fontWeight: 'bold' }]}>{value}</SText>
          )}
          {/*Такая структура из за ошибок с позиционированием*/}
          <View style={styles.underline} />
        </View>
      </View>
    </InputWrapperBlock>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    width: '40%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  valueWrapper: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    flexWrap: 'wrap', // пофиксить
  },
  underline: {
    position: 'absolute',
    left: 0,
    bottom: '20%',
    height: 1,
    width: '100%', // или подбери под макет
    backgroundColor: colors.black,
  },
});

export default CompositeInput;

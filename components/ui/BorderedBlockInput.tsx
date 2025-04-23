import React from 'react';
import { StyleSheet, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import InputWrapperBlock from '@/components/ui/parts/InputWrapperBlock';
import { colors } from '@/constants/colors';

interface BorderedBlockInputProps {
  label: string;
  text: string;
}

const BorderedBlockInput = ({ label, text }: BorderedBlockInputProps) => {
  return (
    <>
      <SText style={styles.formDescription}>{label}</SText>
      <InputWrapperBlock>
        <View style={styles.valueWrapper}>
          <SText style={styles.text}>{text}</SText>
          <View style={styles.underline} />
        </View>
      </InputWrapperBlock>
    </>
  );
};

const styles = StyleSheet.create({
  formDescription: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    paddingHorizontal: 10,
  },
  underline: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 1,
    width: '100%', // или подбери под макет
    backgroundColor: colors.black,
  },
  valueWrapper: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BorderedBlockInput;

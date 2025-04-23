import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

interface InputWrapperBlockProps {
  children: React.ReactNode;
}

const InputWrapperBlock = ({ children }: InputWrapperBlockProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.green.textBlock,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 5,
    marginBottom: 15,
    marginTop: 5,
  },
});

export default InputWrapperBlock;

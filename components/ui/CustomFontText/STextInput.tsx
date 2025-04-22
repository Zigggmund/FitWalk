import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export default function STextInput(props: TextInputProps) {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Sensation',
  },
});

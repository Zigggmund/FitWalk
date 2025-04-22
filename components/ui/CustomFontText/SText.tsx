import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export default function SText(props: TextProps) {
  return <Text {...props} style={[styles.text, props.style]} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Sensation',
  },
});

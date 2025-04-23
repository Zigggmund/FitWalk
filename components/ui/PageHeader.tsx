import React from 'react';
import { StyleSheet, View } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';

type PageHeaderProps = {
  text: string;
};

const PageHeader = ({ text }: PageHeaderProps) => {
  return (
    <View style={styles.container}>
      <SText style={styles.header}>{text}</SText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: colors.green.textBlock,
  },
  header: {
    fontSize: 36,
    textAlign: 'center',
    paddingVertical: 15,
  },
});

export default PageHeader;

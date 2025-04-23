import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

type PageHeaderProps = {
  children: React.ReactNode; // Позволяет передавать любые вложенные элементы
};

const PageHeader = ({ children }: PageHeaderProps) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: colors.green.textBlock,
  },
});

export default PageHeader;

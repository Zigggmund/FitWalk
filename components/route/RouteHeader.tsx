import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

import SText from '@/components/ui/CustomFontText/SText';
import { colors } from '@/constants/colors';

interface RouteHeaderProps {
  isMainPage?: boolean;
  routeTitle: string;
  routeLength: number;
}

const RouteHeader = ({
  isMainPage = true,
  routeTitle,
  routeLength,
}: RouteHeaderProps) => {
  return (
    <Link
      href={isMainPage ? '/(main)/(tabs)' : '/(main)/(tabs)/weather'}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.wrapper}>
          <View style={styles.block}>
            <SText style={[styles.text, !isMainPage && styles.textMultiple]}>
              {routeTitle}
            </SText>
            {!isMainPage ? (
              <SText style={styles.length}>
                ({Math.round(routeLength / 100) / 10}) км
              </SText>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 12,
  },
  block: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    width: '100%',
    gap: 10,
  },
  textMultiple: {
    fontSize: 26,
    width: '60%',
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 32,
    width: '100%',
  },
  length: {
    fontSize: 36,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '40%',
  },
});

export default RouteHeader;

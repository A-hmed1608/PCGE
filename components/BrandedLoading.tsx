import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

/**
 * BrandedLoading Component
 * This component mirrors the native splash screen for a seamless transition.
 * It is also used during OAuth (Facebook/Google) sign-in flows.
 */
export default function BrandedLoading() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0047AB', // Matching the new logo theme
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 100,
  },
});

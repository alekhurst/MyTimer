import React from 'react';
import { StyleSheet, View } from 'react-native';

const HourglassTop = () => <View style={styles.container} />;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: 'white',
    zIndex: 1,
  },
});

export default HourglassTop;

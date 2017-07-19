import React from 'react';
import { StyleSheet, View } from 'react-native';
import Triangle from 'react-native-triangle';
import { vw, vh } from './helpers/viewPercentages';

const PseudoBackground = () =>
  <View style={styles.container} pointerEvents="none">
    <LeftSide />
    <RightSide />
  </View>;

const LeftSide = () =>
  <View style={styles.sideContainer}>
    <View style={[styles.outsideTriangle, styles.leftOfLeftTriangle]} />
    <Triangle
      width={vw(50)}
      height={vh(100)}
      color={'rgb(97,97,97)'}
      direction={'right'}
    />
  </View>;

const RightSide = () =>
  <View style={styles.sideContainer}>
    <View style={[styles.outsideTriangle, styles.rightOfRightTriangle]} />
    <Triangle
      width={vw(50)}
      height={vh(100)}
      color={'rgb(97,97,97)'}
      direction={'left'}
    />
  </View>;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: vw(100),
    height: vh(100),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flex: 1,
    zIndex: 10000,
  },
  sideContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  outsideTriangle: {
    position: 'absolute',
    width: vw(100),
    height: vh(100),
    backgroundColor: 'rgb(97,97,97)',
  },
  leftOfLeftTriangle: {
    left: vw(100),
  },
  rightOfRightTriangle: {
    right: vw(100),
  },
});

export default PseudoBackground;

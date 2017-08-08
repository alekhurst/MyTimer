import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { vw, vh } from './helpers/viewPercentages';

const MAX_MINUTES = 30;
const MAX_SECONDS = MAX_MINUTES * 60;
const CONTAINER_HEIGHT = vh(50) - 80;

const HourglassTop = ({
  resetTimer,
  pitchTimerWasSetAt,
  secondsRemaining,
  numSecsTimerWasSetAt,
}) => {
  const heightPerSec = CONTAINER_HEIGHT / MAX_SECONDS;
  const secondsElapsed = numSecsTimerWasSetAt - secondsRemaining;
  const waterHeight = heightPerSec * secondsElapsed;

  return (
    <View
      style={[styles.container, pitchTimerWasSetAt === null && { zIndex: 200 }]}
    >
      {pitchTimerWasSetAt !== null &&
        <TouchableOpacity
          onPress={resetTimer}
          style={styles.btn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.btnTxt}>Reset</Text>
        </TouchableOpacity>}
      {pitchTimerWasSetAt !== null &&
        <View style={[styles.water, { height: waterHeight }]} />}
      {pitchTimerWasSetAt !== null &&
        <View style={styles.belowWaterExtension} />}
    </View>
  );
};

HourglassTop.propTypes = {
  resetTimer: PropTypes.func.isRequired,
  pitchTimerWasSetAt: PropTypes.number,
  secondsRemaining: PropTypes.number,
  numSecsTimerWasSetAt: PropTypes.number,
};

HourglassTop.defaultProps = {
  pitchTimerWasSetAt: null,
  secondsRemaining: null,
  numSecsTimerWasSetAt: null,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: 'white',
  },
  btn: {
    alignSelf: 'center',
    position: 'relative',
    top: 100,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  btnTxt: {
    color: 'rgb(77,144,220)',
    fontSize: 18,
  },
  water: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: vw(150),
    backgroundColor: 'rgb(77,144,220)',
  },
  belowWaterExtension: {
    position: 'relative',
    top: -200,
    height: 200,
    backgroundColor: 'rgb(77,144,220)',
  },
});

export default HourglassTop;

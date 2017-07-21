import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const HourglassTop = ({ onPressReset, pitchTimerWasSetAt }) =>
  <View style={styles.container}>
    {pitchTimerWasSetAt !== null &&
      <TouchableOpacity
        onPress={onPressReset}
        style={styles.btn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.btnTxt}>Reset</Text>
      </TouchableOpacity>}
  </View>;

HourglassTop.propTypes = {
  onPressReset: PropTypes.func.isRequired,
  pitchTimerWasSetAt: PropTypes.number,
};

HourglassTop.defaultProps = {
  pitchTimerWasSetAt: null,
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: 'white',
    zIndex: 1,
  },
  btn: {
    alignSelf: 'center',
    position: 'relative',
    top: 15,
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
});

export default HourglassTop;

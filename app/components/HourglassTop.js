import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const HourglassTop = ({ onPressReset, timerIsSet }) =>
  <View style={styles.container}>
    {timerIsSet &&
      <TouchableOpacity onPress={onPressReset} style={styles.btn}>
        <Text style={styles.btnTxt}>Reset</Text>
      </TouchableOpacity>}
  </View>;

HourglassTop.propTypes = {
  onPressReset: PropTypes.func.isRequired,
  timerIsSet: PropTypes.bool.isRequired,
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

import React from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';
import HourglassBottom from './components/HourglassBottom';
import HourglassTop from './components/HourglassTop';
import HourglassOverlay from './components/HourglassOverlay';

class App extends React.Component {
  static propTypes = {
    Accelerometer: PropTypes.object, // eslint-disable-line
  };

  state = {
    pitchDeg: '0deg',
    timerSet: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.Accelerometer) {
      // Accelerometer not initialized
      return;
    }

    let pitch = this.calculatePitch(nextProps.Accelerometer);
    pitch = (-pitch * 57.295779513).toFixed(1);
    const pitchDeg = `${pitch}deg`;

    const state = { pitchDeg };
    if (Math.abs(pitch) >= 70) {
      state.timerSet = true;
    }
    this.setState(state);
  }

  calculatePitch = accelerometerData => {
    const { x, y, z } = accelerometerData;
    return Math.atan(x / Math.sqrt(y ** 2 + z ** 2)); // eslint-disable-line
  };

  render() {
    const { pitchDeg, timerSet } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <HourglassTop pitchDeg={pitchDeg} />
        <HourglassBottom pitchDeg={pitchDeg} timerSet={timerSet} />

        {/* this overlay is positioned absolutely
          and doesn't receive touch events */}
        <HourglassOverlay />
      </View>
    );
  }
}

export default sensors({
  Accelerometer: true,
})(App);

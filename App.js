import React from 'react';
import { View, StatusBar } from 'react-native';
import { Accelerometer } from 'expo';
import HourglassBottom from './components/HourglassBottom';
import HourglassTop from './components/HourglassTop';
import HourglassOverlay from './components/HourglassOverlay';

export default class App extends React.Component {
  state = {
    pitchDeg: '0deg',
    timerSet: false,
  };

  componentWillMount() {
    this.accelerometerSubscription = Accelerometer.addListener(res => {
      let pitch = this.calculatePitch(res);
      pitch = (-pitch * 57.295779513).toFixed(1);
      const pitchDeg = `${pitch}deg`;

      const state = { pitchDeg };
      if (Math.abs(pitch) >= 70) {
        console.log(pitchDeg);
        state.timerSet = true;
      }
      this.setState(state);
    });
  }

  componentWillUnmount() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
    }

    this.accelerometerSubscription = null;
  }

  calculatePitch(accelerometerData) {
    const { x, y, z } = accelerometerData;
    return Math.atan(x / Math.sqrt(y ** 2 + z ** 2)); // eslint-disable-line
  }

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

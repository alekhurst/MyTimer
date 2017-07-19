import React from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';
import HourglassBottom from './components/HourglassBottom';
import HourglassTop from './components/HourglassTop';
import HourglassOverlay from './components/HourglassOverlay';
import KeepAwake from 'react-native-keep-awake';

class App extends React.Component {
  static propTypes = {
    Accelerometer: PropTypes.object, // eslint-disable-line
  };

  state = {
    pitch: 0,
    timerIsSet: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.Accelerometer) {
      // Accelerometer not yet initialized
      return;
    }

    let pitch = this.calculatePitch(nextProps.Accelerometer);
    pitch = Number((-pitch * 57.295779513).toFixed(1));

    const state = { pitch };
    if (Math.abs(pitch) >= 65) {
      state.timerIsSet = true;
    }
    this.setState(state);
  }

  onPressReset = () => {
    this.setState({
      timerIsSet: false,
    });
  };

  calculatePitch = accelerometerData => {
    const { x, y, z } = accelerometerData;
    return Math.atan(x / Math.sqrt(y ** 2 + z ** 2)); // eslint-disable-line
  };

  render() {
    const { pitch, timerIsSet } = this.state;

    const containerTransform = {
      transform: [
        {
          rotate: timerIsSet ? `${pitch + 180}deg` : '0deg',
        },
      ],
    };

    return (
      <View style={[{ flex: 1 }, containerTransform]}>
        <KeepAwake />
        <StatusBar hidden />
        <HourglassTop
          onPressReset={this.onPressReset}
          timerIsSet={timerIsSet}
        />
        <HourglassBottom pitch={pitch} timerIsSet={timerIsSet} />

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

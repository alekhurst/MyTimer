import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StatusBar } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';
import KeepAwake from 'react-native-keep-awake';
import HourglassBottom from './components/HourglassBottom';
import HourglassTop from './components/HourglassTop';
import HourglassOverlay from './components/HourglassOverlay';

class App extends React.Component {
  static propTypes = {
    Accelerometer: PropTypes.object, // eslint-disable-line
  };

  state = {
    pitch: 0,
    timerIsSet: false,
    rotationAnim: new Animated.Value(0),
    pitchTimerWasSetAt: null,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.Accelerometer) {
      // Accelerometer not yet initialized
      return;
    }

    let pitch = this.calculatePitch(nextProps.Accelerometer);
    pitch = Number((-pitch * 57.295779513).toFixed(1));

    const state = { pitch };
    if (Math.abs(pitch) >= 60) {
      state.timerIsSet = true;
    }

    this.setState(state);
  }

  componentWillUpdate(nextProps, nextState) {
    const { timerIsSet, pitchTimerWasSetAt } = this.state;

    if (timerIsSet === false && nextState.timerIsSet === true) {
      // timer was just set
      Animated.timing(this.state.rotationAnim, {
        toValue: nextState.pitch < 0 ? -200 : 200,
        duration: 800,
      }).start(() =>
        this.setState({
          pitchTimerWasSetAt: nextState.pitch,
        }),
      );
    } else if (pitchTimerWasSetAt !== null && nextState.timerIsSet === true) {
      // timer has been in set state
      Animated.timing(this.state.rotationAnim, {
        toValue:
          pitchTimerWasSetAt < 0
            ? -180 + nextState.pitch
            : 180 + nextState.pitch,
        duration: 150,
      }).start();
    } else if (nextState.timerIsSet === false && timerIsSet === true) {
      // timer was reset
      Animated.timing(this.state.rotationAnim, {
        toValue: 0,
        duration: 200,
      }).start();
    }
  }

  onPressReset = () => {
    this.setState({
      timerIsSet: false,
      pitchTimerWasSetAt: null,
    });
  };

  calculatePitch = accelerometerData => {
    const { x, y, z } = accelerometerData;
    return Math.atan(x / Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2))); // eslint-disable-line
  };

  render() {
    const { pitch, timerIsSet, rotationAnim, pitchTimerWasSetAt } = this.state;

    const containerTransform = {
      transform: [
        {
          rotate: rotationAnim.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[{ flex: 1 }, containerTransform]}>
        <KeepAwake />
        <StatusBar hidden />
        <HourglassTop
          onPressReset={this.onPressReset}
          pitchTimerWasSetAt={pitchTimerWasSetAt}
        />
        <HourglassBottom
          pitch={pitch}
          timerIsSet={timerIsSet}
          pitchTimerWasSetAt={pitchTimerWasSetAt}
        />

        {/* this overlay is positioned absolutely
          and doesn't receive touch events */}
        <HourglassOverlay />
      </Animated.View>
    );
  }
}

export default sensors({
  Accelerometer: { updateInterval: 75 },
})(App);

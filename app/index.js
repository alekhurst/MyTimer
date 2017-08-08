import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StatusBar } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';
import KeepAwake from 'react-native-keep-awake';
import HourglassBottom from './components/HourglassBottom';
import HourglassTop from './components/HourglassTop';
import HourglassOverlay from './components/HourglassOverlay';
import DripOverlay from './components/DripOverlay';

class App extends React.Component {
  static propTypes = {
    Accelerometer: PropTypes.object, // eslint-disable-line
  };

  state = {
    pitch: 0,
    timerIsSet: false,
    bottomWaterHeight: 0,
    // the difference between this and timerIsSet, is timerIsSet is set to true
    // after the set animation has completed
    pitchTimerWasSetAt: null,
    numSecsTimerWasSetAt: null,
    rotationAnim: new Animated.Value(0),
    secondsRemaining: null,
  };

  componentWillReceiveProps(nextProps) {
    const { bottomWaterHeight } = this.state;
    if (!nextProps.Accelerometer) {
      // Accelerometer not yet initialized
      return;
    }

    let pitch = this.calculatePitch(nextProps.Accelerometer);
    pitch = Number((-pitch * 57.295779513).toFixed(1));

    const nextStateObj = { pitch };
    if (Math.abs(pitch) >= 60 && bottomWaterHeight > 0) {
      nextStateObj.timerIsSet = true;
    }

    this.setState(nextStateObj);
  }

  componentWillUpdate(nextProps, nextState) {
    const { timerIsSet, pitchTimerWasSetAt } = this.state;

    if (timerIsSet === false && nextState.timerIsSet === true) {
      // timer was just set
      Animated.timing(this.state.rotationAnim, {
        toValue: nextState.pitch < 0 ? 140 : -140,
        duration: 700,
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
            ? 180 + nextState.pitch
            : -180 + nextState.pitch,
        duration: 150,
      }).start();
    } else if (nextState.timerIsSet === false && timerIsSet === true) {
      // timer was reset
      Animated.timing(this.state.rotationAnim, {
        toValue: 0,
        duration: 400,
      }).start();
    }
  }

  resetTimer = () => {
    this.setState({
      timerIsSet: false,
      pitchTimerWasSetAt: null,
      secondsRemaining: null,
      numSecsTimerWasSetAt: null,
    });
    clearInterval(this.timerInterval);
  };

  startTimer = totalSeconds => {
    this.setState({
      secondsRemaining: totalSeconds,
      numSecsTimerWasSetAt: totalSeconds,
    });

    this.timerInterval = setInterval(() => {
      this.setState(state => ({
        secondsRemaining: state.secondsRemaining - 1,
      }));
    }, 1000);
  };

  calculatePitch = accelerometerData => {
    const { x, y, z } = accelerometerData;
    return Math.atan(x / Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2))); // eslint-disable-line
  };

  render() {
    const {
      pitch,
      timerIsSet,
      rotationAnim,
      pitchTimerWasSetAt,
      secondsRemaining,
      numSecsTimerWasSetAt,
      bottomWaterHeight,
    } = this.state;

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
          resetTimer={this.resetTimer}
          secondsRemaining={secondsRemaining}
          pitchTimerWasSetAt={pitchTimerWasSetAt}
          numSecsTimerWasSetAt={numSecsTimerWasSetAt}
        />
        <HourglassBottom
          pitch={pitch}
          timerIsSet={timerIsSet}
          pitchTimerWasSetAt={pitchTimerWasSetAt}
          startTimer={this.startTimer}
          secondsRemaining={secondsRemaining}
          waterHeight={bottomWaterHeight}
          setWaterHeight={nextHeight =>
            this.setState({ bottomWaterHeight: nextHeight })}
        />

        {/* this overlay is positioned absolutely
          and doesn't receive touch events */}
        <HourglassOverlay />
        {timerIsSet && <DripOverlay pitch={pitch} />}
      </Animated.View>
    );
  }
}

export default sensors({
  Accelerometer: { updateInterval: 75 },
})(App);

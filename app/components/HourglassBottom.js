import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View, PanResponder, Text } from 'react-native';
import { vw, vh } from './helpers/viewPercentages';

const MAX_MINUTES = 30;
const CONTAINER_HEIGHT = vh(50) - 80;

export default class HourglassBottom extends React.Component {
  static propTypes = {
    timerIsSet: PropTypes.bool.isRequired,
    pitch: PropTypes.number.isRequired,
    pitchTimerWasSetAt: PropTypes.number,
    startTimer: PropTypes.func.isRequired,
    secondsRemaining: PropTypes.number,
    waterHeight: PropTypes.number.isRequired,
    setWaterHeight: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pitchTimerWasSetAt: null,
    secondsRemaining: null,
  };

  state = {
    rotationAnim: new Animated.Value(0),
  };

  componentWillReceiveProps(nextProps) {
    const { pitch, timerIsSet, pitchTimerWasSetAt, startTimer } = this.props;

    if (pitchTimerWasSetAt === null && nextProps.pitchTimerWasSetAt !== null) {
      // timer setting animation just completed
      startTimer(this.getTimeFromWaterHeight() * 60);
    }

    if (timerIsSet && nextProps.timerIsSet) {
      // time has already been set
      return;
    }

    if (timerIsSet === false && nextProps.timerIsSet === true) {
      // timer was just set
      Animated.timing(this.state.rotationAnim, {
        toValue: pitch < 0 ? -180 : 180,
        duration: 800,
      }).start();
    } else if (timerIsSet === false) {
      // timer not set
      Animated.timing(this.state.rotationAnim, {
        toValue: nextProps.pitch,
        duration: 120,
      }).start();
    }
  }

  getTimeFromWaterHeight = () => {
    const { waterHeight } = this.props;
    const portionFull = waterHeight / CONTAINER_HEIGHT;
    return Math.round(MAX_MINUTES * Math.pow(portionFull, 2)); // eslint-disable-line
  };

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (evt, { y0 }) => {
      const waterHeight = vh(100) - y0;
      this.setState({ waterHeight });
    },
    onPanResponderMove: (evt, { y0, dy }) => {
      const waterHeight = vh(100) - (y0 + dy);

      if (waterHeight >= CONTAINER_HEIGHT) {
        this.setState({ waterHeight: CONTAINER_HEIGHT });
        return;
      }

      this.props.setWaterHeight(waterHeight);
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => true,
    onPanResponderTerminate: () => this.setState({ waterHeight: 0 }),
    onShouldBlockNativeResponder: () => true,
  });

  render() {
    const {
      timerIsSet,
      pitchTimerWasSetAt,
      secondsRemaining,
      waterHeight,
    } = this.props;
    const { rotationAnim } = this.state;

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
      <Animated.View style={[styles.container, containerTransform]}>
        <View
          style={styles.innerContainer}
          {...(timerIsSet ? {} : this.panResponder.panHandlers)}
        >
          {pitchTimerWasSetAt === null &&
            waterHeight > 0 &&
            <Text style={[styles.time, { bottom: waterHeight }]}>
              {this.getTimeFromWaterHeight()}
            </Text>}
          {pitchTimerWasSetAt !== null &&
            <Text style={[styles.time, { bottom: waterHeight }]}>
              {Math.floor(secondsRemaining / 60)}:{secondsRemaining % 60 || '00'}
            </Text>}
          <View style={[styles.water, { height: waterHeight }]} />
          {waterHeight > 0 &&
            pitchTimerWasSetAt === null &&
            <View style={[styles.water, styles.belowWaterExtension]} />}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  innerContainer: {
    height: CONTAINER_HEIGHT,
    width: vw(100),
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  time: {
    position: 'relative',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'rgb(77,144,220)',
  },
  water: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    width: vw(150),
    backgroundColor: 'rgb(77,144,220)',
  },
  belowWaterExtension: {
    bottom: -100,
    height: 100,
  },
});

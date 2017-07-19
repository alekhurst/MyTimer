import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, PanResponder, Text } from 'react-native';
import { vw, vh } from './helpers/viewPercentages';

const MAX_MINUTES = 30;
const CONTAINER_HEIGHT = vh(50) - 60;

export default class HourglassBottom extends React.Component {
  static propTypes = {
    timerIsSet: PropTypes.bool.isRequired,
    pitch: PropTypes.number.isRequired,
  };

  state = {
    waterInGlass: false,
    waterHeight: 0,
  };

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (evt, { y0 }) => {
      const waterHeight = vh(100) - y0;
      this.setState({ waterHeight, waterInGlass: false });
    },
    onPanResponderMove: (evt, { y0, dy }) => {
      const waterHeight = vh(100) - (y0 + dy);

      if (waterHeight >= CONTAINER_HEIGHT) {
        this.setState({ waterHeight: CONTAINER_HEIGHT });
        return;
      }

      this.setState({ waterHeight });
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => this.setState({ waterInGlass: true }),
    onPanResponderTerminate: () =>
      this.setState({ waterHeight: 0, waterInGlass: false }),
    onShouldBlockNativeResponder: () => true,
  });

  getTimeFromWaterHeight = () => {
    const { waterHeight } = this.state;
    const portionFull = waterHeight / CONTAINER_HEIGHT;
    return Math.round(MAX_MINUTES * portionFull ** 2); // eslint-disable-line
  };

  render() {
    const { pitch, timerIsSet } = this.props;
    const { waterHeight } = this.state;

    const containerTransform = {
      transform: [
        {
          rotate: timerIsSet ? '180deg' : `${pitch}deg`,
        },
        {
          translateY: timerIsSet ? 0 : Math.abs(pitch / 2),
        },
      ],
    };

    return (
      <View style={[styles.container, containerTransform]}>
        <View
          style={styles.innerContainer}
          {...(timerIsSet ? {} : this.panResponder.panHandlers)}
        >
          {!timerIsSet &&
            waterHeight > 0 &&
            <Text
              style={[
                styles.time,
                {
                  bottom: waterHeight,
                  left: this.getTimeFromWaterHeight() * -pitch / MAX_MINUTES,
                },
              ]}
            >
              {this.getTimeFromWaterHeight()}
            </Text>}
          {timerIsSet &&
            <Text style={[styles.time, { bottom: waterHeight }]}>
              {this.getTimeFromWaterHeight()}:00
            </Text>}
          <View style={[styles.water, { height: waterHeight }]} />
          {waterHeight > 0 &&
            <View style={[styles.water, styles.belowWaterExtension]} />}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    zIndex: 0,
    justifyContent: 'flex-end',
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

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, PanResponder, Text } from 'react-native';
import { vw, vh } from './helpers/viewPercentages';

const MAX_MINUTES = 45;

export default class HourglassBottom extends React.Component {
  static propTypes = {
    pitchDeg: PropTypes.string.isRequired,
    timerSet: PropTypes.bool.isRequired,
  };

  state = {
    waterInGlass: false,
    waterHeight: 0,
    setPitchDeg: null,
  };

  componentWillReceiveProps(nextProps) {
    const { timerSet, pitchDeg } = this.props;
    if (!timerSet && nextProps.timerSet) {
      this.setState({
        setPitchDeg: pitchDeg,
      });
    }
  }

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

      if (waterHeight >= vh(50)) {
        this.setState({ waterHeight: vh(50) });
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

  render() {
    const { pitchDeg, timerSet } = this.props;
    const { waterHeight, setPitchDeg } = this.state;

    const portionFull = (vh(50) - (vh(50) - waterHeight)) / vh(50);
    const time = Math.round(MAX_MINUTES * portionFull ** 2); // eslint-disable-line

    return (
      <View
        style={[
          styles.container,
          { transform: [{ rotate: timerSet ? setPitchDeg : pitchDeg }] },
        ]}
        {...this.panResponder.panHandlers}
      >
        {waterHeight > 0 &&
          <Text style={[styles.time, { bottom: waterHeight }]}>
            {time}
          </Text>}
        <View style={[styles.water, { height: waterHeight }]} />
        {waterHeight > 0 &&
          <View style={[styles.water, styles.belowWaterExtension]} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 0,
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

import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import Dash from 'react-native-dash';
import { vw, vh } from './helpers/viewPercentages';

class DripOverlay extends Component {
  static propTypes = {
    pitch: PropTypes.number.isRequired,
  };

  state = {
    dashAnim: new Animated.Value(0),
    rotationAnim: new Animated.Value(0),
  };

  componentDidMount() {
    const { dashAnim } = this.state;
    Animated.loop(
      Animated.timing(dashAnim, {
        toValue: vh(50) + 4,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
        loop: true,
      }),
    ).start();
  }

  componentWillReceiveProps(nextProps) {
    const { pitch } = this.props;
    if (nextProps.pitch !== pitch) {
      Animated.timing(this.state.rotationAnim, {
        toValue: nextProps.pitch,
        duration: 150,
      }).start();
    }
  }

  render() {
    const { dashAnim, rotationAnim } = this.state;

    const rotationTransform = {
      transform: [
        {
          rotate: rotationAnim.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '120deg'],
          }),
        },
      ],
    };

    return (
      <Animated.View
        style={[styles.container, rotationTransform]}
        pointerEvents="none"
      >
        {/* Drip #2 */}
        <Animated.View
          style={[
            styles.dripsContainer,
            {
              transform: [{ translateY: dashAnim }],
            },
          ]}
          pointerEvents="none"
        >
          <Dash
            style={styles.drips}
            dashColor="rgb(77,144,220)"
            dashGap={4}
            dashLength={8}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: vw(100),
    height: vh(100),
    flex: 1,
  },
  dripsContainer: {
    position: 'absolute',
    height: vh(100),
    width: vw(100),
    top: 0,
    flex: 1,
    alignItems: 'center',
  },
  drips: {
    flexDirection: 'column',
    flex: 1,
  },
};

export default DripOverlay;

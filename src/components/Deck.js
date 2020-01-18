/** @format */

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  UIManager,
  LayoutAnimation
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;

class Deck extends Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponser = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });
    this.panResponser = panResponser;
    this.position = position;
    this.state = {
      index: 0
    };
  }

  UNSAFE_componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  getCardStyle = () => {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    };
  };

  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: {
        x: 0,
        y: 0
      }
    }).start();
  };

  forceSwipe = direction => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.position, {
      toValue: {
        x,
        y: 0
      },
      duration: 250
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  };

  onSwipeComplete = direction => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  };

  renderCard = () => {
    const { index } = this.state;
    return this.props.data
      .map((item, idx) => {
        if (idx < index) {
          return null;
        }
        if (idx === index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.panResponser.panHandlers}
            >
              {this.props.renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            style={[styles.cardStyle, { top: 10 * (idx - index) }]}
            key={item.id}
          >
            {this.props.renderCard(item, index)}
          </Animated.View>
        );
      })
      .reverse();
  };

  render() {
    return <View style={{ flex: 1 }}>{this.renderCard()}</View>;
  }
}

Deck.defaultProps = {
  onSwipeRight: () => {},
  onSwipeLeft: () => {}
};

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 100
  }
});

export default Deck;

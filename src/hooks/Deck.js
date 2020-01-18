/** @format */

import React, { Component, useState, useRef, useEffect } from "react";
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

const Deck = ({ data, renderCard, onSwipeLeft, onSwipeRight }) => {
  const [index, setIndex] = useState(0);

  const position = new Animated.ValueXY();
  const panResponser = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else {
        resetPosition();
      }
    }
  });
  // init state and ref
  const positionRef = useRef(position);
  const panResponserRef = useRef(panResponser);

  const getCardStyle = () => {
    const rotate = positionRef.current.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      ...positionRef.current.getLayout(),
      transform: [{ rotate }]
    };
  };

  const resetPosition = () => {
    Animated.spring(positionRef.current, {
      toValue: {
        x: 0,
        y: 0
      }
    }).start();
  };

  const forceSwipe = direction => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(positionRef.current, {
      toValue: {
        x,
        y: 0
      },
      duration: 250
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = direction => {
    const item = data[index];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    positionRef.current.setValue({ x: 0, y: 0 });
    setIndex(i => i + 1);
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  };

  return data
    .map((item, idx) => {
      if (idx < index) {
        return null;
      }
      if (idx === index) {
        return (
          <Animated.View
            key={item.id}
            style={[getCardStyle(), styles.cardStyle]}
            {...panResponserRef.current.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <Animated.View
          style={[styles.cardStyle, { top: 10 * (idx - index) }]}
          key={item.id}
        >
          {renderCard(item)}
        </Animated.View>
      );
    })
    .reverse();
};

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 100,
  }
});

export default Deck;

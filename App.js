/** @format */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import { DATA } from "./src/utils/constant";

// components
// import Ball from "./src/Ball";
// import Deck from "./src/Deck";
import Deck from "./src/hooks/Deck";

export default class App extends React.Component {
  renderCard = item => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.uri }} style={styles.image} />
        <Text>{item.text}</Text>
      </View>
    );
  };

  onSwipeLeft = () => {};

  onSwipeRight = () => {};

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    margin: 10
  },
  image: {
    width: "100%",
    height: 150
  }
});

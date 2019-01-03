import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default class Loading extends React.Component {
  static navigationOptions = {
    title: "Loading"
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

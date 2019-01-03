import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import selectors from "~/Selectors";
import { connect } from "react-redux";

class Loading extends React.Component {
  static navigationOptions = {
    title: "Loading"
  };

  render() {
    return (
      this.props.isLoading && (
        <View style={styles.loadingView}>
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        </View>
      )
    );
  }
}
const styles = StyleSheet.create({
  loadingView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000",
    opacity: 0.7
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default connect(state => ({ isLoading: selectors.ui.isLoading(state) }))(
  Loading
);

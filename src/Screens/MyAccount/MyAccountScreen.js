import React, { Component } from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";

class MyAccountScreen extends Component {
  logOut = () => {
    const { logOut, navigation, toggleLoading } = this.props;
    logOut()
      .then(() => {
        navigation.navigate("Login");
      })
      .finally(() => toggleLoading());
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title={"Log out"} onPress={this.logOut} />
      </View>
    );
  }
}

export default connect(
  state => {
    return {};
  },
  dispatch => ({
    logOut: () => dispatch(actions.auth.makeLogOut()),
    toggleLoading: () => dispatch(actions.ui.toggleLoading())
  })
)(MyAccountScreen);

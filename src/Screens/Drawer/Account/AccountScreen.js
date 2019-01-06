import React, { Component } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import selectors from "~/Selectors";

class AccountScreen extends Component {
  static navigationOptions = {
    title: "Account"
  };

  logOut = () => {
    const { logOut, navigation } = this.props;
    logOut().then(() => {
      navigation.navigate("Login");
    });
  };

  render() {
    const { authInfo } = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{authInfo.email}</Text>
        <Button title={"Log out"} onPress={this.logOut} />
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      authInfo: selectors.auth.getAuthInfo(state)
    };
  },
  dispatch => ({
    logOut: () => dispatch(actions.auth.makeLogOut())
  })
)(AccountScreen);

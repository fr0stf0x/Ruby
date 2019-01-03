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
    const { userInfo } = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{userInfo.email}</Text>
        <Button title={"Log out"} onPress={this.logOut} />
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      userInfo: selectors.auth.userInfo(state)
    };
  },
  dispatch => ({
    logOut: () => dispatch(actions.auth.makeLogOut())
  })
)(AccountScreen);

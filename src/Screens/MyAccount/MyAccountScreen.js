import React, { Component } from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";

class MyAccountScreen extends Component {
  logOut = () => {
    const { dispatch } = this.props;
    dispatch(actions.auth.makeLogOut());
  };

  componentDidMount() {}

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title={"Log out"} onPress={this.logOut} />
      </View>
    );
  }
}

export default connect(state => {
  return {};
})(MyAccountScreen);

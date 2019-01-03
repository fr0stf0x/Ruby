import React, { Component } from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";

class WelcomeScreen extends Component {
  componentDidMount() {
    const { isUserLoggedIn, navigation } = this.props;
    !isUserLoggedIn && navigation.navigate("Login");
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Dashboard"
          onPress={() => navigation.navigate("Dashboard")}
        />
      </View>
    );
  }
}

export default connect(state => {
  return {
    isUserLoggedIn: selectors.auth.isUserLoggedIn(state)
  };
})(WelcomeScreen);

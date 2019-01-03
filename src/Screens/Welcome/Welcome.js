import React, { Component } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
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
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Ahihi</Text>
          <Button
            title="Dashboard"
            onPress={() => navigation.navigate("Dashboard")}
          />
        </View>
      </View>
    );
  }
}
WelcomeScreen.navigationOptions = {
  title: "Welcome"
};

export default connect(state => {
  return {
    isUserLoggedIn: selectors.auth.isUserLoggedIn(state)
  };
})(WelcomeScreen);

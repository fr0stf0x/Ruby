import React, { Component } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";

class WelcomeScreen extends Component {
  componentDidMount() {
    const { dispatch, authInfo } = this.props;
    authInfo &&
      promiseWithLoadingAnimation(() =>
        dispatch(actions.data.initAppData(authInfo))
      );
  }

  render() {
    const { navigation, authInfo } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>{authInfo.email}</Text>
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
    authInfo: selectors.auth.getAuthInfo(state)
  };
})(WelcomeScreen);

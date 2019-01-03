import {
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator,
  withNavigation
} from "react-navigation";
import LoginScreen from "~/Screens/Login";
import WelcomeScreen from "~/Screens/Welcome";
import HomeStackNavigator from "~/Screens/Home/index";
import MyAccountScreen from "~/Screens/MyAccount/MyAccountScreen";
import Loading from "~/Screens/Loading";
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import selectors from "./Selectors";

const RootDrawer = createDrawerNavigator({
  Home: {
    screen: HomeStackNavigator
  },
  "My Account": {
    screen: MyAccountScreen
  }
});

const RootSwitch = createSwitchNavigator(
  {
    Loading: {
      screen: Loading
    },
    Login: {
      screen: LoginScreen
    },
    Welcome: {
      screen: WelcomeScreen
    },
    Dashboard: {
      screen: RootDrawer
    }
  },
  {
    initialRouteName: "Login"
  }
);

export const AppContainer = createAppContainer(RootSwitch);

class Ruby extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AppContainer />
        {this.props.isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: "gray",
              opacity: 0.6
            }}
          >
            <Loading />
          </View>
        )}
      </View>
    );
  }
}

export default connect(state => ({
  isLoading: selectors.ui.isLoading(state)
}))(Ruby);

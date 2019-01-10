import { createStackNavigator } from "react-navigation";
import AccountScreen from "./AccountScreen";

import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const AccountStack = createStackNavigator(
  {
    Account: {
      screen: AccountScreen
    }
  },
  {
    navigationOptions: {
      drawerLabel: "Tài khoản",
      drawerIcon: <Icon name="ios-person" size={30} />
    }
  }
);

export default AccountStack;

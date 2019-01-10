import { createStackNavigator } from "react-navigation";
import SettingScreen from "./SettingScreen";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const SettingStack = createStackNavigator(
  {
    Setting: {
      screen: SettingScreen
    }
  },
  {
    navigationOptions: {
      drawerLabel: "Cài đặt",
      drawerIcon: <Icon name="ios-settings" size={30} />
    }
  }
);

export default SettingStack;

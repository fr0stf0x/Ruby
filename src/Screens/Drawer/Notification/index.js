import { createStackNavigator } from "react-navigation";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

import NotificationScreen from "./NotificationScreen";

const NotificationStack = createStackNavigator(
  {
    NotificationScreen
  },
  {
    navigationOptions: {
      drawerLabel: "Thông báo",
      drawerIcon: <Icon name="ios-notifications" size={30} />
    }
  }
);

export default NotificationStack;

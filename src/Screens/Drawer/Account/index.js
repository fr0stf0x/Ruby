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
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30}
            onPress={() => navigation.openDrawer()}
          />
        )
      };
    }
  }
);

export default AccountStack;

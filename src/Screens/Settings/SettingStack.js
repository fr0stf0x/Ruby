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

export default SettingStack;

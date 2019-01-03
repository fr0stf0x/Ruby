import { createStackNavigator } from "react-navigation";
import SignUpScreen from "./SignUp";
import Login from "./Login";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    SignUp: {
      screen: SignUpScreen
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        title: "Authentication",
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

export default AuthStack;

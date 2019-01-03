import {
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import HomeStackNavigator from "~/Screens/Home/index";
import Loading from "~/Screens/Loading";
import LoginScreen from "~/Screens/Login";
import MyAccountScreen from "~/Screens/MyAccount/MyAccountScreen";
import WelcomeScreen from "~/Screens/Welcome";

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

const AppContainer = createAppContainer(RootSwitch);

export default AppContainer;

import {
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import HomeTabNavigator from "~/Screens/Home/index";
import Loading from "~/Screens/Loading";
import AccountStack from "./Screens/Account/AccountStack";
import AuthStack from "./Screens/Auth/AuthStack";
import SettingStack from "./Screens/Settings/SettingStack";
import WelcomeStack from "./Screens/Welcome/WelcomeStack";

const RootDrawer = createDrawerNavigator({
  Home: {
    screen: HomeTabNavigator
  },
  Account: {
    screen: AccountStack
  },
  Setting: {
    screen: SettingStack
  }
});

const RootSwitch = createSwitchNavigator(
  {
    Loading: {
      screen: Loading
    },
    Login: {
      screen: AuthStack
    },
    Welcome: {
      screen: WelcomeStack
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

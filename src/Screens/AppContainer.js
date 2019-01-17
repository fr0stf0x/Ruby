import { createAppContainer, createSwitchNavigator } from "react-navigation";
import DashboardDrawer from "~/Screens/Drawer";
import Loading from "~/Screens/Loading";
import AuthStack from "./Auth";
import WelcomeStack from "./Welcome";
import AccessDenied from "./AccessDenied";

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
    Dashboard: DashboardDrawer,
    AccessDeniedScreen: AccessDenied
  },
  {
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(RootSwitch);
export default AppContainer;

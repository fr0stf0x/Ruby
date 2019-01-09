import { createDrawerNavigator } from "react-navigation";
import AccountStack from "./Account";
import DashboardBottomNav from "./Home";
import SettingStack from "./Settings";
import AgenciesStack from "./Agencies";

const DashboardDrawer = createDrawerNavigator(
  {
    Home: DashboardBottomNav,
    Agencies: AgenciesStack,
    Account: AccountStack,
    Setting: SettingStack
  },
  {
    initialRouteName: "Home"
  }
);

export default DashboardDrawer;

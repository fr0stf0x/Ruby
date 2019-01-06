import { createDrawerNavigator } from "react-navigation";
import AccountStack from "./Account";
import DashboardBottomNav from "./BottomNav";
import SettingStack from "./Settings";
import AgenciesStack from "./Agencies";

const DashboardDrawer = createDrawerNavigator(
  {
    Home: {
      screen: DashboardBottomNav
    },
    Agencies: {
      screen: AgenciesStack
    },
    Account: {
      screen: AccountStack
    },
    Setting: {
      screen: SettingStack
    }
  },
  {
    initialRouteName: "Agencies"
  }
);

export default DashboardDrawer;

import { createDrawerNavigator } from "react-navigation";
import store from "~/configureStore";
import selectors from "~/Selectors";
import AccountStack from "./Account";
import AgenciesStack from "./Agencies";
import CreateOrderStack from "./CreateOrder";
import CreateQuotationStack from "./CreateQuotation";
import DashboardBottomNav from "./Home";

const drawerScreens = appMode => {
  const screens = {
    Home: DashboardBottomNav,
    Agencies: AgenciesStack,
    CreateQuotation: CreateQuotationStack,
    CreateOrder: CreateOrderStack,
    Account: AccountStack
  };
  return screens;
};

const DashboardDrawer = createDrawerNavigator(
  drawerScreens(selectors.ui.getAppMode(store.getState())),
  {
    initialRouteName: "Home"
  }
);

export default DashboardDrawer;

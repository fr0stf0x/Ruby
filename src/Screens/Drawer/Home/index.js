import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "react-navigation";
import IconWithBadge from "~/Components/IconWithBadge";
import { globalColorsAndStyles } from "~/Theme";
import OrdersStack from "./Orders";
import ProductStack from "./Products";
import QuotationsStack from "./Quotations";
import appConstants from "~/appConstants";
import store from "~/configureStore";
import selectors from "~/Selectors";

const tabIconNames = {
  Products: "ios-albums",
  Orders: "ios-cart",
  Quotations: "ios-list"
};

const tabScreens = appMode => {
  const screens = {
    Products: ProductStack
  };
  screens.Orders = OrdersStack;
  screens.Quotations = QuotationsStack;
  return screens;
};

const DashboardBottomNav = createBottomTabNavigator(
  tabScreens(selectors.ui.getAppMode(store.getState())),
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ tintColor }) => {
          const { routeName } = navigation.state;
          let iconName = tabIconNames[routeName];
          return (
            <IconWithBadge name={iconName} color={tintColor} badgeCount={1} />
          );
        }
      };
    },
    navigationOptions: {
      drawerLabel: "Trang chủ",
      drawerIcon: <Icon name="ios-home" size={30} />
    },
    tabBarOptions: {
      style: {
        paddingTop: 10
      },
      activeTintColor: globalColorsAndStyles.color.primary,
      labelStyle: {
        fontSize: 14
      }
    }
  }
);

export default DashboardBottomNav;

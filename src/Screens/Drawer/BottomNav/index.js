import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import { globalColorsAndStyles } from "~/Theme";
import IconWithBadge from "./IconWithBadge";
import OrdersStack from "./Orders";
import ProductStack from "./Products";
import QuotationsStack from "./Quotations";

const tabIconNames = {
  Products: "ios-albums",
  Orders: "ios-cart",
  Quotations: "ios-list"
};

const DashboardBottomNav = createBottomTabNavigator(
  {
    Products: {
      screen: ProductStack
    },
    Orders: {
      screen: OrdersStack
    },
    Quotations: {
      screen: QuotationsStack
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName = tabIconNames[routeName];
          return (
            <IconWithBadge name={iconName} color={tintColor} badgeCount={1} />
          );
        }
      };
    },
    tabBarOptions: {
      activeTintColor: globalColorsAndStyles.color.primary,
      labelStyle: {
        fontSize: 14
      }
    }
  }
);

export default DashboardBottomNav;

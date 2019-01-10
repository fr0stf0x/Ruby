import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import { globalColorsAndStyles } from "~/Theme";
import IconWithBadge from "./IconWithBadge";
import OrdersStack from "./Orders";
import ProductStack from "./Products";
import QuotationsStack from "./Quotations";
import Icon from "react-native-vector-icons/Ionicons";

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
      activeTintColor: globalColorsAndStyles.color.primary,
      labelStyle: {
        fontSize: 14
      }
    }
  }
);

export default DashboardBottomNav;

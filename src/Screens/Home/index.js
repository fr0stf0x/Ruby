import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import OrdersScreen from "./Orders";
import ProductsScreen from "./Products";
import QuotationsScreen from "./Quotations";

const HomeTabNavigator = createBottomTabNavigator(
  {
    Products: {
      screen: ProductsScreen
    },
    Orders: {
      screen: OrdersScreen
    },
    Quotations: {
      screen: QuotationsScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName
      };
    },
    tabBarOptions: {
      activeTintColor: "#e91e63",
      labelStyle: {
        fontSize: 14
      }
    }
  }
);

const HomeStackNavigator = createStackNavigator(
  {
    HomeTabNavigator: {
      screen: HomeTabNavigator
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
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

export default HomeStackNavigator;

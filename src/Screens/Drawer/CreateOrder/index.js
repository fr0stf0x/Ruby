import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import CreateOrderScreen from "./CreateOrderScreen";

const CreateOrderStack = createStackNavigator(
  {
    CreateOrderScreen
  },
  {
    navigationOptions: {
      drawerLabel: "Tạo đơn đặt hàng",
      drawerIcon: <Icon name="ios-cart" size={30} />
    }
  }
);

export default CreateOrderStack;

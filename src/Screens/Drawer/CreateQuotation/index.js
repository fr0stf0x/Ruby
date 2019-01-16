import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import CreateQuotationScreen from "./CreateQuotationScreen";
import SelectAgenciesScreen from "./SelectAgenciesScreen";

const CreateQuotationStack = createStackNavigator(
  {
    CreateQuotationScreen,
    SelectAgenciesScreen
  },
  {
    navigationOptions: {
      drawerLabel: "Tạo báo giá",
      drawerIcon: <Icon name="ios-list" size={30} />
    }
  }
);

export default CreateQuotationStack;

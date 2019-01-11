import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import AgenciesScreen from "./AgenciesScreen";
import CreateAccount from "./CreateAccount";
import GroupInfoForm from "./CreateAgency";
import AgencyDetail from "./AgencyDetail";
import SelectProducts from "./SelectProducts";

const AgenciesStack = createStackNavigator(
  {
    AgenciesScreen,
    CreateAccount,
    GroupInfoForm,
    AgencyDetail,
    SelectProducts
  },
  {
    navigationOptions: {
      drawerLabel: "Danh sách đại lý",
      drawerIcon: <Icon name="ios-people" size={30} />
    }
  }
);

export default AgenciesStack;

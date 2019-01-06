import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import AgenciesScreen from "./AgenciesScreen";
import GroupInfoForm from "./CreateAgency";
import CreateAccount from "./CreateAccount";

const AgenciesStack = createSwitchNavigator({
  AgenciesScreen: {
    screen: createStackNavigator({ AgenciesScreen })
  },
  CreateAgency: {
    screen: createStackNavigator({
      CreateAccount,
      GroupInfoForm
    })
  }
});

export default AgenciesStack;

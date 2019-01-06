import { createStackNavigator } from "react-navigation";
import AgenciesScreen from "./AgenciesScreen";
import CreateAccount from "./CreateAccount";
import GroupInfoForm from "./CreateAgency";

const AgenciesStack = createStackNavigator({
  AgenciesScreen,
  CreateAccount,
  GroupInfoForm
});

export default AgenciesStack;

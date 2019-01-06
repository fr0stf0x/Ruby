import { createStackNavigator } from "react-navigation";
import Welcome from "./Welcome";

const WelcomeStack = createStackNavigator({
  Welcome: Welcome
});

export default WelcomeStack;

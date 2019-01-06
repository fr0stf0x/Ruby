import { createStackNavigator } from "react-navigation";
import Login from "./Login";
import SignUpScreen from "./SignUp";

const AuthStack = createStackNavigator({
  Login: {
    screen: Login
  },
  SignUp: {
    screen: SignUpScreen
  }
});

export default AuthStack;

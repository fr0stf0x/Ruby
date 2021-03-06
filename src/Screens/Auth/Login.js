import React, { Component } from "react";
import {
  Platform,
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View
} from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import actions from "~/Actions";
import selectors from "~/Selectors";
import { promiseWrapper } from "~/Utils/utils";
import types from "~/Actions/ActionTypes";

class LoginScreen extends Component {
  static navigationOptions = {
    title: "Login"
  };

  state = {
    email: "",
    password: "",
    passwordShown: false
  };

  getAccountAsync = async () => {
    const { toggleLoading } = this.props;
    toggleLoading();
    try {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      if (email && password) {
        this.setState({ email, password });
      }
    } finally {
      toggleLoading();
    }
  };

  componentDidMount() {
    const { isUserLoggedIn, navigation, clearAppData, clearCart } = this.props;
    (isUserLoggedIn && navigation.navigate("Welcome")) ||
      (clearAppData() && clearCart() && this.getAccountAsync());
  }

  toggleRevealPassword = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  logIn = async () => {
    const { email, password } = this.state;
    const { logIn, navigation, toggleLoading } = this.props;
    toggleLoading();
    const { error, data } = await promiseWrapper(logIn({ email, password }));
    if (!error) {
      navigation.navigate("Welcome");
    }
    toggleLoading();
  };

  render() {
    const { email, passwordShown, password } = this.state;
    const { authError, navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            behavior={Platform.select({ ios: "padding", android: "none" })}
            enabled
          >
            <Input
              placeholder="Email"
              value={email}
              onChangeText={email => this.setState({ email })}
              leftIcon={<Icon name="account" size={24} color="black" />}
            />
            <Input
              placeholder="Mật khẩu"
              secureTextEntry={!passwordShown}
              value={password}
              returnKeyType="go"
              onSubmitEditing={this.logIn}
              onChangeText={password => this.setState({ password })}
              leftIcon={
                <Icon name="textbox-password" size={24} color="black" />
              }
              rightIcon={
                password.length > 0 && (
                  <Icon
                    name={(passwordShown && "eye-off") || "eye"}
                    onPress={this.toggleRevealPassword}
                    size={24}
                  />
                )
              }
            />
            <Text style={{ color: "red" }}>{authError.message}</Text>
            <Button
              title="Đăng nhập"
              buttonStyle={{
                backgroundColor: "rgba(92, 99, 216, 1)"
              }}
              onPress={this.logIn}
            />
            <Button
              title="Đăng kí"
              buttonStyle={{
                backgroundColor: "rgba(200, 125, 231, 1)"
              }}
              onPress={() => navigation.navigate("SignUp")}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    isUserLoggedIn: selectors.auth.isUserLoggedIn(state),
    authError: selectors.auth.getAuthError(state)
  }),
  dispatch => ({
    logIn: ({ email, password }) =>
      dispatch(actions.auth.makeLogIn({ email, password })),
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    clearAppData: () => dispatch({ type: types.data.CLEAR_DATA }),
    clearCart: () => dispatch({ type: types.cart.CLEAR_CART })
  })
)(LoginScreen);

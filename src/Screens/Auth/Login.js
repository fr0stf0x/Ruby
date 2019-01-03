import React, { Component } from "react";
import { AsyncStorage, View } from "react-native";
import { Button, Header, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import actions from "~/Actions";
import selectors from "~/Selectors";

class LoginScreen extends Component {
  static navigationOptions = {
    title: "Login"
  };

  state = {
    email: "",
    password: ""
  };

  getAccountAsync = async () => {
    const { toggleLoading } = this.props;
    toggleLoading();
    try {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      if (email !== null && password !== null) {
        this.setState({ email, password });
      }
    } finally {
      toggleLoading();
    }
  };

  componentDidMount() {
    const { isUserLoggedIn, navigation } = this.props;
    (isUserLoggedIn && navigation.navigate("Welcome")) ||
      this.getAccountAsync();
  }

  logIn = () => {
    const { email, password } = this.state;
    const { logIn, navigation } = this.props;
    logIn({ email, password }).then(() => navigation.navigate("Welcome"));
  };

  render() {
    const { email, password } = this.state;
    const { authError, navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {/* <Header centerComponent={{ text: "LOGIN", style: { color: "#fff" } }} /> */}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Input
            placeholder="Email"
            value={email}
            onChangeText={email => this.setState({ email })}
            errorMessage={authError.message}
            leftIcon={<Icon name="account" size={24} color="black" />}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={password => this.setState({ password })}
            leftIcon={<Icon name="textbox-password" size={24} color="black" />}
          />
          <Button
            title="Login"
            buttonStyle={{
              backgroundColor: "rgba(92, 99, 216, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
              margin: 10
            }}
            onPress={this.logIn}
          />
          <Button
            title="Sign up"
            buttonStyle={{
              backgroundColor: "rgba(200, 125, 231, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
            }}
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    isUserLoggedIn: selectors.auth.isUserLoggedIn(state),
    authError: selectors.auth.authError(state)
  }),
  dispatch => ({
    logIn: ({ email, password }) =>
      dispatch(actions.auth.makeLogIn({ email, password })),
    toggleLoading: () => dispatch(actions.ui.toggleLoading())
  })
)(LoginScreen);

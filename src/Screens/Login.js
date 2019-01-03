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
    } catch (error) {
      // Error retrieving data
      console.warn("You have not signed");
    } finally {
      toggleLoading();
    }
  };

  componentDidMount() {
    const { isUserLoggedIn, navigation } = this.props;
    if (isUserLoggedIn) {
      navigation.navigate("Welcome");
    } else {
      this.getAccountAsync();
    }
  }

  logIn = () => {
    const { email, password } = this.state;
    const { logIn, navigation, toggleLoading } = this.props;
    logIn({ email, password })
      .then(() => navigation.navigate("Welcome"))
      .finally(() => {
        toggleLoading();
      });
  };

  render() {
    const { email, password } = this.state;
    const { authError } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header centerComponent={{ text: "LOGIN", style: { color: "#fff" } }} />
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
            style={{ margin: 10 }}
            primary
            block
            onPress={this.logIn}
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

import React, { Component } from "react";
import { YellowBox } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import store from "~/configureStore";
import AppContainer from "~/Screens/AppContainer";
import Loading from "~/Screens/Loading";
import theme from "~/Theme";

YellowBox.ignoreWarnings(["Require cycle:"]);
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContainer />
          <Loading />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;

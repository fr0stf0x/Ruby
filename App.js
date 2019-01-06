import React, { Component } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "react-native-elements";

import AppContainer from "~/Screens/AppContainer";
import Loading from "~/Screens/Loading";
import theme from "~/Theme";
import store from "~/configureStore";
import { YellowBox } from "react-native";

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

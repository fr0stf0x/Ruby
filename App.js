/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import Ruby, { AppContainer } from "~/Ruby";
import configureStore from "~/configureStore";
import theme from "~/Theme";

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* <Ruby /> */}
          <AppContainer />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;

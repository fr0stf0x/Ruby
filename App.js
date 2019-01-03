import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import AppContainer from "~/AppContainer";
import configureStore from "~/configureStore";
import Loading from "~/Screens/Loading";
import theme from "~/Theme";

const store = configureStore();

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

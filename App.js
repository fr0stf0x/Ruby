import React, { Component } from "react";
import { Platform, YellowBox } from "react-native";
import { ThemeProvider } from "react-native-elements";

import { Provider } from "react-redux";
import store from "~/configureStore";
import AppContainer from "~/Screens/AppContainer";
import Loading from "~/Screens/Loading";
import theme from "~/Theme";
import firebase from "react-native-firebase";

import type {
  RemoteMessage,
  Notification,
  NotificationOpen
} from "react-native-firebase";

YellowBox.ignoreWarnings(["Require cycle:"]);
class App extends Component {
  componentDidMount() {
    if (Platform.OS === "android") {
      console.log("adding message listener");
      this.notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened((notificationOpen: NotificationOpen) => {
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;
          console.log("onNotificationOpened", action, notification);
        });
      this.notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed((notification: Notification) => {
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID.
          // You will have to specify this manually if you'd like to re-display the notification.
          console.log("onNotificationDisplayed", notification);
        });
      this.messageListener = firebase
        .messaging()
        .onMessage((message: RemoteMessage) => {
          // Process your message as required
          console.log("onMessage", message);
        });
      this.notificationListener = firebase
        .notifications()
        .onNotification((notification: Notification) => {
          // Process your notification as required
          console.log("onNotification", notification);
        });
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      this.messageListener();
      this.notificationDisplayedListener();
      this.notificationOpenedListener();
      this.notificationListener();
    }
  }

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

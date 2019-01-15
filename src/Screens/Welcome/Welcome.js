// @flow

import React, { Component } from "react";
import { Platform, View } from "react-native";
import { Button, Text } from "react-native-elements";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";

import type {
  RemoteMessage,
  Notification,
  NotificationOpen
} from "react-native-firebase";

class WelcomeScreen extends Component {
  async componentDidMount() {
    const { dispatch, authInfo, navigation } = this.props;
    authInfo &&
      promiseWithLoadingAnimation(() =>
        dispatch(actions.data.initAppData(authInfo))
      );

    if (Platform.OS === "android") {
      const notifications = firebase.notifications();
      const notificationOpen: NotificationOpen = await notifications.getInitialNotification();
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        notification.onclick = e => {
          e.preventDefault();
          console.log("prevenDefaulkt");
        };
        console.log("app opened");
      }
      console.log("adding message listener");
      this.notificationOpenedListener = notifications.onNotificationOpened(
        (notificationOpen: NotificationOpen) => {
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;
          notification.onclick();
          console.log("onNotificationOpened", action, notification);
        }
      );
      this.notificationDisplayedListener = notifications.onNotificationDisplayed(
        (notification: Notification) => {
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID.
          // You will have to specify this manually if you'd like to re-display the notification.
          console.log("onNotificationDisplayed", notification);
        }
      );
      // this.messageListener = firebase
      //   .messaging()
      //   .onMessage((message: RemoteMessage) => {
      //     // Process your message as required
      //     console.log("onMessage", message);
      //   });
      this.notificationListener = notifications.onNotification(
        (notification: Notification) => {
          // Process your notification as required
          console.log("onNotification", notification);
        }
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      // this.messageListener();
      this.notificationDisplayedListener();
      this.notificationOpenedListener();
      this.notificationListener();
    }
  }

  render() {
    const { navigation, authInfo } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>{authInfo.email}</Text>
          <Button
            title="Dashboard"
            onPress={() => navigation.navigate("Dashboard")}
          />
        </View>
      </View>
    );
  }
}

WelcomeScreen.navigationOptions = {
  title: "Welcome"
};

export default connect(state => {
  return {
    authInfo: selectors.auth.getAuthInfo(state)
  };
})(WelcomeScreen);

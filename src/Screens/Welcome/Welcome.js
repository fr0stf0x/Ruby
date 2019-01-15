// @flow

import React, { Component } from "react";
import { Platform, View } from "react-native";
import { Button, Text } from "react-native-elements";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";

class WelcomeScreen extends Component {
  componentDidMount() {
    const { dispatch, authInfo } = this.props;
    authInfo &&
      promiseWithLoadingAnimation(() =>
        dispatch(actions.data.initAppData(authInfo))
          .then(this.listenForNotificationsIfNeeded)
          .catch(err => {
            console.log(err);
          })
      );
  }

  componentWillUnmount() {
    this.unListenForNotificationsIfNeeded();
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

  listenForNotificationsIfNeeded = async () => {
    if (Platform.OS === "android") {
      console.log("adding message listener");
      const notifications = firebase.notifications();
      const notificationOpen = await notifications.getInitialNotification();
      if (notificationOpen) {
        console.log("app opened");
      }
      this.notificationOpenedListener = notifications.onNotificationOpened(
        notificationOpen => {
          const action = notificationOpen.action;
          const notification: Notification = notificationOpen.notification;
          console.log("onNotificationOpened", action, notification);
        }
      );
      this.notificationDisplayedListener = notifications.onNotificationDisplayed(
        notification => {
          console.log("onNotificationDisplayed", notification);
        }
      );
      this.notificationListener = notifications.onNotification(notification => {
        console.log("onNotification", notification);
      });
      // this.messageListener = firebase
      //   .messaging()
      //   .onMessage((message: RemoteMessage) => {
      //     console.log("onMessage", message);
      //   });
    }
  };

  unListenForNotificationsIfNeeded = () => {
    if (Platform.OS === "android") {
      // this.messageListener();
      this.notificationDisplayedListener &&
        this.notificationDisplayedListener();
      this.notificationOpenedListener && this.notificationOpenedListener();
      this.notificationListener && this.notificationListener();
    }
  };
}

WelcomeScreen.navigationOptions = {
  title: "Welcome"
};

export default connect(state => {
  return {
    authInfo: selectors.auth.getAuthInfo(state)
  };
})(WelcomeScreen);

// @flow

import React, { Component } from "react";
import { StyleSheet, Image, Platform, View } from "react-native";
import { Button, Text } from "react-native-elements";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

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
    const { navigation, userProfile, groupInfo } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {groupInfo &&
          !groupInfo.loading &&
          userProfile &&
          !userProfile.loading && (
            <View style={styles.container}>
              <Text style={styles.title}>{userProfile.info.name}</Text>
              <Text style={styles.title}>{groupInfo.name}</Text>

              <Image
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
                source={{ uri: groupInfo.localImage || groupInfo.imageUrl }}
              />
              <Button
                title="Dashboard"
                onPress={() => navigation.navigate("Dashboard")}
              />
            </View>
          )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    color: globalColorsAndStyles.color.primaryText,
    fontSize: 18
  }
});

export default connect(state => {
  return {
    authInfo: selectors.auth.getAuthInfo(state),
    userProfile: selectors.data.getUserProfile(state),
    groupInfo: selectors.data.getGroupInfo(state)
  };
})(WelcomeScreen);

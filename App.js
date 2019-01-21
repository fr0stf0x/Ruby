import React, { Component } from "react";
import { Platform, YellowBox } from "react-native";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import store from "~/configureStore";
import AppContainer from "~/Screens/AppContainer";
import Loading from "~/Screens/Loading";
import theme from "~/Theme";
import firebase from "react-native-firebase";
import { NavigationActions } from "react-navigation";
import Snackbar from "react-native-snackbar";

YellowBox.ignoreWarnings(["Require cycle:"]);
class App extends Component {
  componentDidMount = () => {
    this.listenForNotificationsIfNeeded();
  };

  componentWillUnmount = () => {
    this.unListenForNotificationsIfNeeded();
  };

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
        // const Snackbar = React.lazy(() => import("react-native-snackbar"));
        Snackbar.show({
          title: notification.body,
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: "XEM",
            color: "green",
            onPress: () => {
              console.log(notification.data);
              switch (notification.data.type) {
                case "quotation":
                  return this.goToDetail("QuotationDetail", {
                    id: notification.data.id
                  });
                case "order":
                  return this.goToDetail("OrderDetail", {
                    id: notification.data.id
                  });
                default:
                  return this.goToDetail("ProductDetail", {
                    id: notification.data.productId
                  });
              }
            }
          }
        });
      });
      this.messageListener = firebase.messaging().onMessage(message => {
        console.log("onMessage", message);
      });
    }
  };

  unListenForNotificationsIfNeeded = () => {
    if (Platform.OS === "android") {
      this.messageListener();
      console.log("unListen for notification");
      this.notificationDisplayedListener &&
        this.notificationDisplayedListener();
      this.notificationOpenedListener && this.notificationOpenedListener();
      this.notificationListener && this.notificationListener();
    }
  };

  goToDetail = (routeName, params) => {
    this.navigator &&
      this.navigator.dispatch(
        NavigationActions.navigate({
          routeName,
          params
        })
      );
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AppContainer
            ref={nav => {
              this.navigator = nav;
            }}
          />
          <Loading />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;

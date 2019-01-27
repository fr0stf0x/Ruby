// @flow

import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

class WelcomeScreen extends Component {
  componentDidMount() {
    const { dispatch, authInfo, needToClearApp } = this.props;
    authInfo &&
      needToClearApp &&
      promiseWithLoadingAnimation(() =>
        dispatch(actions.data.initAppData(authInfo)).catch(err => {
          console.log(err);
        })
      );
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
              {/* <Image
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
                source={{ uri: groupInfo.localImage || groupInfo.imageUrl }}
              /> */}
              <Button
                title="Dashboard"
                onPress={() => navigation.navigate("Dashboard")}
              />
            </View>
          )}
      </View>
    );
  }
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
    groupInfo: selectors.data.getGroupInfo(state),
    needToClearApp: state.appData !== {}
  };
})(WelcomeScreen);

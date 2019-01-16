import React, { Component } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import selectors from "~/Selectors";
import Icon from "react-native-vector-icons/Ionicons";
import { promiseWithLoadingAnimation } from "~/Actions/global";

class AccountScreen extends Component {
  dologOut = () => {
    const { logOut, navigation } = this.props;
    promiseWithLoadingAnimation(() =>
      logOut().then(async () => {
        navigation.navigate("Login");
      })
    );
  };

  render() {
    const { authInfo } = this.props;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{authInfo.email}</Text>
        <Button title={"Log out"} onPress={this.dologOut} />
      </View>
    );
  }
}

AccountScreen.navigationOptions = ({ navigation }) => ({
  title: "Settings",
  headerLeft: (
    <Icon
      style={{ paddingLeft: 10 }}
      name="md-menu"
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  )
});

export default connect(
  state => {
    return {
      authInfo: selectors.auth.getAuthInfo(state)
    };
  },
  dispatch => ({
    logOut: () => dispatch(actions.auth.makeLogOut())
  })
)(AccountScreen);

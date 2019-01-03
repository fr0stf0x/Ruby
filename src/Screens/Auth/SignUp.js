import React, { Component } from "react";
import { Linking, View } from "react-native";
import { Text } from "react-native-elements";

class SignUpScreen extends Component {
  showOptions = tel => {
    const url = `tel:${tel}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url).catch(() => null);
      }
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 25
        }}
      >
        <Text h3>
          Hiện tại chúng tôi không cung cấp khả năng đăng kí tài khoản.
        </Text>
        <Text h3>Vui lòng liên hệ</Text>
        <Text
          h3
          style={{ marginLeft: 5, textDecorationLine: "underline" }}
          onPress={() => this.showOptions("0906561545")}
        >
          090 656 15 45
        </Text>
        <Text h3>để được hướng dẫn!</Text>
      </View>
    );
  }
}
SignUpScreen.navigationOptions = {
  title: "Sign Up"
};

export default SignUpScreen;

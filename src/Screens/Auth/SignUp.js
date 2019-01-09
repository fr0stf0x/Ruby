import React, { Component } from "react";
import { Image, View } from "react-native";
import { Text } from "react-native-elements";
import { makeCall } from "~/Utils/utils";

class SignUpScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10
        }}
      >
        <Image
          style={{ maxHeight: 250, maxWidth: 250 }}
          source={require("~/assets/img/sad-emoji.jpg")}
        />
        <Text h3>
          Hiện tại chúng tôi không cung cấp khả năng đăng kí tài khoản.
        </Text>
        <Text h3>Vui lòng liên hệ</Text>
        <Text
          h3
          style={{ marginLeft: 5, textDecorationLine: "underline" }}
          onPress={() => makeCall("0906561545")}
        >
          090 656 1545
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

import React from "react";
import { Image, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { globalColorsAndStyles } from "~/Theme";

const AccessDenied = ({ navigation, mode }) => {
  const goHome = () => navigation.navigate("Home");
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Image
        style={{ maxHeight: 250, maxWidth: 250 }}
        source={require("~/assets/img/sad-emoji.jpg")}
      />
      <Text style={{ fontSize: 32, color: globalColorsAndStyles.color.error }}>
        Xin lỗi
      </Text>
      <Text style={{ fontSize: 24, color: globalColorsAndStyles.color.error }}>
        Chức năng này không có sẵn cho tài khoản {mode}
      </Text>
      <Button title="Quay về trang chủ" onPress={goHome} />
    </View>
  );
};

export default AccessDenied;

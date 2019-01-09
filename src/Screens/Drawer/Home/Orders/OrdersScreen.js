import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

class OrdersScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>OrdersScreen</Text>
        <Button
          onPress={() => this.props.navigation.navigate("CreateOrder")}
          title={"Tạo đơn đặt hàng"}
        />
      </View>
    );
  }
}

OrdersScreen.navigationOptions = ({ navigation }) => ({
  title: "Danh sách đặt hàng",
  headerLeft: (
    <Icon
      style={{ paddingLeft: 10 }}
      name="md-menu"
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  ),
  headerRight: (
    <Icon
      style={{ paddingRight: 10 }}
      name="ios-add"
      size={30}
      onPress={() => navigation.navigate("CreateOrder")}
    />
  )
});

export default OrdersScreen;

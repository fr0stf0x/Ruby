import React, { Component } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import OrderList from "~/Components/OrderList";

class OrdersScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <OrderList navigation={this.props.navigation} />
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

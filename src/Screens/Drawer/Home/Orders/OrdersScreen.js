import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import OrderList from "~/Components/OrderList";

class OrdersScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <OrderList navigation={this.props.navigation} />
        </ScrollView>
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

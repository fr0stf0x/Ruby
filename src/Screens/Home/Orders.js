import React, { Component } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class OrdersScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>OrdersScreen</Text>
      </View>
    );
  }
}
OrdersScreen.navigationOptions = {
  tabBarIcon: <Icon name="list-alt" size={20} />
};

export default OrdersScreen;

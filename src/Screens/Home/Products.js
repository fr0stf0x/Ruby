import React, { Component } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class ProductsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>ProductsScreen</Text>
      </View>
    );
  }
}
ProductsScreen.navigationOptions = {
  tabBarIcon: <Icon name="product-hunt" size={20} />
};

export default ProductsScreen;

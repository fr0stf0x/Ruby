import React, { Component } from "react";
import { Text, View } from "react-native";

class AddProduct extends Component {
  static navigationOptions = {
    title: "Thêm sản phẩm"
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>AddProduct</Text>
      </View>
    );
  }
}

export default AddProduct;

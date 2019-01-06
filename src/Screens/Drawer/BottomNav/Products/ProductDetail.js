import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";

class ProductDetail extends Component {
  render() {
    const { product } = this.props;
    return (
      <View
        style={{
          padding: 10,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View style={{ flex: 2 }}>
          <Text>Mã sản phẩm:</Text>
          <Text>Tên sản phẩm:</Text>
          <Text>Giá sản phẩm:</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text>{product.id}</Text>
          <Text>{product.name}</Text>
          <Text>{product.price}</Text>
        </View>
      </View>
    );
  }
}

export default connect((state, props) => ({
  product: selectors.data.getProductByIdFromNavigationParam(state, props)
}))(ProductDetail);

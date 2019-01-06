import React, { Component } from "react";
import { View, Image } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { Text } from "react-native-elements";
import { randomImage } from "~/Utils/utils";

class ProductDetail extends Component {
  render() {
    const { product } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Image style={{ alignSelf: "center" }} source={randomImage()} />
        <View
          style={{
            alignSelf: "center",
            paddingHorizontal: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={{ flex: 2 }}>
            <Text>Tên sản phẩm:</Text>
            <Text>Loại sản phẩm:</Text>
            {product.detail.createdAt && <Text>Ngày ra mắt</Text>}
          </View>
          <View style={{ flex: 3 }}>
            <Text>{product.detail.name}</Text>
            <Text>{product.detail.type}</Text>
            {product.detail.createdAt && (
              <Text>{product.detail.createdAt.toString()}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default connect((state, props) => ({
  product: selectors.data.getProductByIdFromNavigationParam(state, props)
}))(ProductDetail);

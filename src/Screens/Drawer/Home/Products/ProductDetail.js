import React, { Component } from "react";
import { Image, View } from "react-native";
import { Text, ThemeProvider } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { formatDate } from "~/Utils/utils";

class ProductDetail extends Component {
  static navigationOptions = {
    title: "Chi tiết"
  };

  render() {
    const { product } = this.props;
    console.log(product);
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Image
          style={{ width: 300, height: 300, alignSelf: "center" }}
          source={{
            uri: product.detail.imageUrl
          }}
        />
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
          <ThemeProvider theme={theme}>
            <View style={{ flex: 1 }}>
              <Text>Tên sản phẩm:</Text>
              <Text>Loại sản phẩm:</Text>
              {product.detail.createdAt && <Text>Ngày ra mắt</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text>{product.detail.name}</Text>
              <Text>{product.detail.type}</Text>
              {product.detail.createdAt && (
                <Text>{formatDate(product.detail.createdAt)}</Text>
              )}
            </View>
          </ThemeProvider>
        </View>
      </View>
    );
  }
}

const theme = {
  Text: {
    style: {
      fontSize: 20
    }
  }
};

export default connect((state, props) => ({
  product: selectors.data.getProductByIdFromNavigationParam(state, props)
}))(ProductDetail);

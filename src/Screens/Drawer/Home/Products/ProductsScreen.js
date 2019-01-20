import React, { Component } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { Text } from "react-native-elements";

class ProductsScreen extends Component {
  render() {
    const { availableProductIds, notAvailableProductIds } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ProductItemContext.Provider
          value={{
            type: appConstants.productItemContext.SHOW,
            action: { navigation: this.props.navigation }
          }}
        >
          <ProductList productIds={availableProductIds} />
          {notAvailableProductIds.length > 0 && (
            <View>
              <Text style={{ fontSize: 18, textAlign: "center" }}>
                Sản phẩm không có sẵn
              </Text>
              <ProductList productIds={notAvailableProductIds} />
            </View>
          )}
        </ProductItemContext.Provider>
      </View>
    );
  }
}

ProductsScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Danh sách sản phẩm",
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
        onPress={() => navigation.navigate("AddProduct")}
      />
    )
  };
};

export default connect(state => ({
  availableProductIds: selectors.data.getProductIdsByType(state, {
    type: "available"
  }),
  notAvailableProductIds: selectors.data.getProductIdsByType(state, {
    type: "not_available"
  })
}))(ProductsScreen);

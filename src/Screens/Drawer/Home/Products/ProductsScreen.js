import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";

class ProductsScreen extends Component {
  addProduct = () => {
    this.props.navigation.navigate("AddProduct");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <ProductItemContext.Provider
            value={{
              type: appConstants.productItemContext.SHOW,
              action: { navigation: this.props.navigation }
            }}
          >
            <ProductList type="available" />
            <ProductList type="not_available" />
          </ProductItemContext.Provider>
        </ScrollView>
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

export default ProductsScreen;

import React, { Component } from "react";
import { FlatList, View, ScrollView } from "react-native";
import { Button, ListItem, Text } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import Icon from "react-native-vector-icons/Ionicons";
import { mergeObj } from "~/Reducers/utils";

class ProductsScreen extends Component {
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item: { detail, id } }) => {
    return (
      <ListItem
        onPress={() => this.props.navigation.navigate("ProductDetail", { id })}
        title={detail.name}
        subtitle={detail.type}
      />
    );
  };

  addProduct = () => {};

  render() {
    const { allIds, byId } = this.props.products;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 2 }}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={allIds.map(id => {
              console.log(mergeObj(byId[id], { id }));
              return mergeObj(byId[id], { id });
            })}
            renderItem={this.renderItem}
          />
        </ScrollView>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button
            title="Thêm sản phẩm"
            onPress={() => {
              this.props.navigation.navigate("AddProduct");
            }}
          />
        </View>
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
    )
  };
};

export default connect(state => ({
  products: selectors.data.getProducts(state)
}))(ProductsScreen);

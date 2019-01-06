import React, { Component } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { randomImage } from "~/Utils/utils";

class ProductsScreen extends Component {
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item: { detail, id }, index }) => {
    console.log(index);
    return (
      <ListItem
        containerStyle={styles(index).listItem}
        title={detail.name}
        titleStyle={styles(index).listItemTitle}
        subtitle={detail.type}
        leftAvatar={{ source: randomImage() }}
        onPress={() => this.props.navigation.navigate("ProductDetail", { id })}
      />
    );
  };

  addProduct = () => {
    this.props.navigation.navigate("AddProduct");
  };

  render() {
    const { allIds, byId } = this.props.products;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={allIds.map(id => mergeObj(byId[id], { id }))}
            renderItem={this.renderItem}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = key =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      marginHorizontal: 10,
      marginVertical: 5,
      backgroundColor:
        key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
    },
    listItemTitle: {
      color:
        key % 2
          ? globalColorsAndStyles.color.secondaryText
          : globalColorsAndStyles.color.primaryText
    }
  });

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
  products: selectors.data.getProducts(state)
}))(ProductsScreen);

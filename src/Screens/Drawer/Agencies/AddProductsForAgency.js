import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

class AddProductsForAgency extends Component {
  state = {
    error: false
  };

  componentDidMount() {
    const { currentProductsOfAgency, toggleCheckProduct } = this.props;
    currentProductsOfAgency &&
      currentProductsOfAgency.allIds.forEach(id => toggleCheckProduct(id));
  }

  goBackToList = () => {
    this.props.navigation.navigate("AgenciesScreen");
  };
  render() {
    const { error } = this.state;
    const { addProductsToAgency, availableProductIds } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.products}>
          <ProductItemContext.Provider
            value={{ type: appConstants.productItemContext.ADD_TO_AGENCY }}
          >
            <ProductList productIds={availableProductIds} />
          </ProductItemContext.Provider>
        </ScrollView>
        <View style={{ padding: 10 }}>
          {error && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: globalColorsAndStyles.color.error
              }}
            >
              {error}
            </Text>
          )}
          <Button
            style={{ alignSelf: "center", width: 150 }}
            title="Đồng ý"
            onPress={() =>
              promiseWithLoadingAnimation(() =>
                addProductsToAgency()
                  .then(() => {
                    this.setState({ error: false });
                    Alert.alert("Thành công", "", [
                      {
                        text: "Quay lại danh sách",
                        onPress: this.goBackToList
                      }
                    ]);
                  })
                  .catch(err => {
                    this.setState({ error: err });
                  })
              )
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  actionText: {
    fontSize: 17,
    color: "#2a72ef",
    paddingEnd: 5
  },
  products: {
    flex: 1
  }
});

AddProductsForAgency.navigationOptions = {
  title: "Thêm sản phẩm",
  headerRight: (
    <Text
      style={styles.actionText}
      onPress={() =>
        actions.global.globalToggleCheckProducts(
          appConstants.productItemContext.ADD_TO_AGENCY
        )
      }
    >
      Chọn tất cả
    </Text>
  )
};

export default connect(
  state => {
    const agencyId = selectors.cart.getSelectedAgenciesInCart(
      state,
      appConstants.productItemContext.ADD_TO_AGENCY
    )[0];
    const allProductIds = selectors.data.getProducts(state).allIds;
    const currentProductsOfAgency = selectors.data.getProductsOfAgency(state, {
      id: agencyId
    });
    return {
      availableProductIds: allProductIds,
      currentProductsOfAgency
    };
  },
  dispatch => ({
    addProductsToAgency: () =>
      dispatch(actions.data.makeAddProductsToAgencies()),
    toggleCheckProduct: id =>
      dispatch(
        actions.cart.toggleCheckProduct({
          id,
          endpoint: appConstants.productItemContext.ADD_TO_AGENCY
        })
      )
  })
)(AddProductsForAgency);

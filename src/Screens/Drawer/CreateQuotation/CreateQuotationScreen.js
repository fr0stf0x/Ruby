import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import appConstants from "~/appConstants";
import AgenciesBox from "~/Components/AgenciesBox";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import store from "~/configureStore";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

class CreateQuotationScreen extends Component {
  state = {
    error: false
  };

  goBackToList = () => {
    this.props.navigation.navigate("Products");
  };

  showAlertIfNewProductsDetected = () => {
    const {
      selectedAgencyIds,
      agencies,
      allProducts,
      addProductsToAgencies
    } = this.props;
    const productsOfAgency = agencyId =>
      selectors.data.getProductsOfAgency(store.getState(), {
        id: agencyId
      });
    const nameOfProduct = productId => allProducts.byId[productId].detail.name;
    const nameOfAgency = agencyId => agencies.byId[agencyId].detail.info.name;
    let message = "";
    let missingProductsInAgencies = {};
    selectedAgencyIds.forEach(agencyId => {
      let missingProducts = [];
      allProducts.allIds.forEach(productId => {
        if (!productsOfAgency(agencyId).allIds.includes(productId)) {
          message = message.concat(
            `Đại lý ${nameOfAgency(agencyId)} không có sản phẩm ${nameOfProduct(
              productId
            )}\n`
          );
          missingProducts.push(productId);
        }
      });
      missingProductsInAgencies[agencyId] = missingProducts;
    });
    console.log(missingProductsInAgencies);
    Alert.alert("Cảnh báo", message, [
      {
        text: "Thêm tất cả và gởi báo giá",
        onPress: () =>
          promiseWithLoadingAnimation(() =>
            addProductsToAgencies(missingProductsInAgencies)
              .then(this.doCreateQuotation)
              .catch(err => console.log(err))
          )
      },
      { text: "Huỷ bỏ", style: "cancel" }
    ]);
  };

  validateForm = () => {
    const {
      doGetProductsOfAgency,
      selectedAgencyIds,
      allProducts
    } = this.props;
    promiseWithLoadingAnimation(() =>
      Promise.all(selectedAgencyIds.map(id => doGetProductsOfAgency(id))).then(
        async () => {
          const productsOfAgency = agencyId =>
            selectors.data.getProductsOfAgency(store.getState(), {
              id: agencyId
            });
          if (
            selectedAgencyIds.every(agencyId =>
              allProducts.allIds.every(productId =>
                productsOfAgency(agencyId).allIds.includes(productId)
              )
            )
          ) {
            return this.doCreateQuotation();
          } else {
            return this.showAlertIfNewProductsDetected();
          }
        }
      )
    );
  };

  doCreateQuotation = () =>
    promiseWithLoadingAnimation(() =>
      this.props
        .createQuotation()
        .then(() => {
          this.setState({ error: false });
          Alert.alert("Thành công", "Đợi đối phương xác nhận", [
            {
              text: "Quay về trang chủ",
              onPress: this.goBackToList
            }
          ]);
        })
        .catch(error => {
          this.setState({ error });
        })
    );

  render() {
    const { error } = this.state;
    const { allProducts } = this.props;
    const productIds = allProducts.allIds;
    return (
      <View style={styles.container}>
        <AgenciesBox navigation={this.props.navigation} />
        <ScrollView style={styles.products}>
          <ProductItemContext.Provider
            value={{ type: appConstants.productItemContext.QUOTATION }}
          >
            <ProductList productIds={productIds} />
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
            onPress={this.validateForm}
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

CreateQuotationScreen.navigationOptions = ({ navigation }) => ({
  title: "Tạo báo giá",
  headerLeft: (
    <Icon
      style={{ paddingLeft: 10 }}
      name="md-menu"
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  ),
  headerRight: (
    <Text
      style={styles.actionText}
      onPress={() => actions.global.globalToggleCheckProducts()}
    >
      Chọn tất cả
    </Text>
  )
});

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state),
    selectedAgencyIds: selectors.cart.getSelectedAgenciesInCart(state),
    allProducts: selectors.data.getProducts(state)
  }),
  dispatch => ({
    doGetProductsOfAgency: id =>
      dispatch(actions.data.getAgencyProductsIfNeeded(id)),
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    removeAgency: id => dispatch(actions.cart.toggleCheckAgency(id)),
    createQuotation: () => dispatch(actions.data.makeCreateQuotation()),
    addProductsToAgencies: missingProductsInAgencies =>
      dispatch(actions.global.addProductsToAgencies(missingProductsInAgencies))
  })
)(CreateQuotationScreen);
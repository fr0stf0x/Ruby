import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

class CreateOrder extends Component {
  state = {
    error: false
  };

  goBackToList = () => {
    this.props.navigation.navigate("OrderList");
  };

  render() {
    const { error } = this.state;
    const { createOrder, toggleLoading } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.products}>
          <ProductItemContext.Provider
            value={{ type: appConstants.productItemContext.ORDER }}
          >
            <ProductList type="available" />
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
            onPress={() => {
              toggleLoading();
              createOrder()
                .then(() => {
                  this.setState({ error: false });
                  Alert.alert("Thành công", "", [
                    {
                      text: "Đợi đối phương xác nhận",
                      onPress: this.goBackToList
                    }
                  ]);
                })
                .catch(err => {
                  this.setState({ error: err });
                })
                .finally(toggleLoading);
            }}
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

CreateOrder.navigationOptions = {
  title: "Tạo đơn đặt hàng"
};

export default connect(
  state => ({
    products: selectors.cart.getProductsInCart(state, {
      endpoint: appConstants.productItemContext.ORDER
    })
  }),
  dispatch => ({
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    createOrder: () => dispatch(actions.data.makeCreateOrder())
  })
)(CreateOrder);

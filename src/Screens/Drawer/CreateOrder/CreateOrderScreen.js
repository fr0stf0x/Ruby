import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import Icon from "react-native-vector-icons/Ionicons";
import { promiseWithLoadingAnimation } from "~/Actions/global";

class CreateOrderScreen extends Component {
  state = {
    error: false
  };

  goBackToList = () => {
    this.props.navigation.navigate("OrderList");
  };

  doCreateOrder = () =>
    promiseWithLoadingAnimation(() =>
      this.props
        .createOrder()
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
    const { products } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.products}>
          <ProductItemContext.Provider
            value={{ type: appConstants.productItemContext.ORDER }}
          >
            <ProductList productIds={products.allIds} />
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
            onPress={this.doCreateOrder}
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

CreateOrderScreen.navigationOptions = ({ navigation }) => ({
  title: "Tạo đơn đặt hàng",
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
      onPress={() =>
        actions.global.globalToggleCheckProducts(
          appConstants.productItemContext.ORDER
        )
      }
    >
      Chọn tất cả
    </Text>
  )
});

export default connect(
  state => ({
    products: selectors.data.getProducts(state)
  }),
  dispatch => ({
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    createOrder: () => dispatch(actions.data.makeCreateOrder())
  })
)(CreateOrderScreen);

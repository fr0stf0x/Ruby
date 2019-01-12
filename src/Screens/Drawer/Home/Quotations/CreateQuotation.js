import React, { Component } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import AgenciesBox from "~/Components/AgenciesBox";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { promiseWithLoadingAnimation } from "~/Actions/global";

class CreateQuotation extends Component {
  state = {
    error: false
  };

  goBackToList = () => {
    this.props.navigation.navigate("QuotationList");
  };

  render() {
    const { error } = this.state;
    const { createQuotation } = this.props;
    return (
      <View style={styles.container}>
        <AgenciesBox navigation={this.props.navigation} />
        <ScrollView style={styles.products}>
          <ProductItemContext.Provider
            value={{ type: appConstants.productItemContext.QUOTATION }}
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
            onPress={() =>
              promiseWithLoadingAnimation(() =>
                createQuotation()
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

CreateQuotation.navigationOptions = {
  title: "Tạo báo giá",
  headerRight: (
    <Text
      style={styles.actionText}
      onPress={() => actions.global.globalToggleCheckProducts()}
    >
      Chọn tất cả
    </Text>
  )
};

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state),
    selectedAgencyIds: selectors.cart.getSelectedAgenciesInCart(state),
    products: selectors.cart.getProductsInCart(state, {
      endpoint: appConstants.productItemContext.QUOTATION
    })
  }),
  dispatch => ({
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    removeAgency: id => dispatch(actions.cart.toggleCheckAgency(id)),
    createQuotation: () => dispatch(actions.data.makeCreateQuotation())
  })
)(CreateQuotation);

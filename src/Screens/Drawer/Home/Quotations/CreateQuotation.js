import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import AgenciesBox from "~/Components/AgenciesBox";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import selectors from "~/Selectors";

class CreateQuotation extends Component {
  render() {
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
      onPress={actions.global.globalToggleCheckProducts}
    >
      Chọn tất cả
    </Text>
  )
};

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state),
    selectedAgencyIds: selectors.cart.getSelectedAgenciesInCreatingQuotation(
      state
    )
  }),
  dispatch => ({
    removeAgency: id => dispatch(actions.cart.toggleCheckAgency(id))
  })
)(CreateQuotation);

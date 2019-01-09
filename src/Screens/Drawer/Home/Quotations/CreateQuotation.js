import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text, Button } from "react-native-elements";
import ProductList, { ProductItemContext } from "~/Components/ProductList";
import appConstants from "~/appConstants";
import { globalColorsAndStyles } from "~/Theme";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import Icon from "react-native-vector-icons/Ionicons";
import actions from "~/Actions";

class CreateQuotation extends Component {
  static navigationOptions: {
    title: "Tạo báo giá"
  };

  render() {
    // TODO:  select agency name
    // TODO:  style cho agency name
    const { agencyIds, agencies, removeAgency } = this.props;
    return (
      <View style={styles.container}>
        {/* agencies */}
        <View style={styles.agenciesBox}>
          {agencyIds &&
            agencyIds.map((agencyId, key) => (
              <View key={key} style={styles.agencyItem}>
                <Text style={{ fontSize: 15 }}>
                  {agencies.byId[agencyId].detail.info.name}
                </Text>
                <Icon
                  style={{ marginHorizontal: 2 }}
                  color="red"
                  name="ios-remove-circle-outline"
                  size={24}
                  onPress={() => removeAgency(agencyId)}
                />
              </View>
            ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.props.navigation.navigate("SelectAgencies")}
          >
            <Icon name="ios-add" size={20} />
          </TouchableOpacity>
        </View>
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
  addButton: {
    ...globalColorsAndStyles.style.boxShadow,
    backgroundColor: globalColorsAndStyles.color.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    width: 48,
    height: 48
  },
  agenciesBox: {
    ...globalColorsAndStyles.style.boxShadow,
    flexDirection: "row",
    margin: 5,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#4286f4"
  },
  agencyItem: {
    ...globalColorsAndStyles.style.boxShadow,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "rgba(126,183,164,0.9)",
    borderColor: "#4286f4"
  },
  products: {
    flex: 1
  }
});

export default connect(
  state => ({
    agencyIds: selectors.cart.getAgenciesInCreatingQuotation(state),
    agencies: selectors.data.getAgencies(state)
  }),
  dispatch => ({
    removeAgency: id => dispatch(actions.cart.removeAgencyFromCart(id))
  })
)(CreateQuotation);

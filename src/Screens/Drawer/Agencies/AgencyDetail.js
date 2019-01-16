import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { Card, Text, Button } from "react-native-elements";
import { globalColorsAndStyles } from "~/Theme";
import { makeCall } from "~/Utils/utils";
import actions from "~/Actions";
import Icon from "react-native-vector-icons/Ionicons";
import appConstants from "~/appConstants";
import ProductList, { ProductItemContext } from "~/Components/ProductList";

class AgencyDetail extends Component {
  componentDidMount() {
    this.props.getAgencyProducts();
  }
  render() {
    const {
      agency,
      productsOfAgency,
      toggleAddAgencyToCartAndRedirect,
      redirectToAddProductsForAgency
    } = this.props;
    const { info } = agency.detail;
    return (
      <ScrollView>
        <Card
          containerStyle={globalColorsAndStyles.style.boxShadow}
          title={info.name}
          image={{ uri: info.imageUrl }}
        >
          <View>
            <View
              style={{
                height: 150,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={styles.agencyInfo}>{info.address}</Text>
              <Text style={styles.agencyInfo}>{info.phone}</Text>
              <Text style={styles.agencyInfo}>
                {info.type === appConstants.groupType.AGENCY
                  ? "Đại lý"
                  : "Nhà bán lẻ"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                title="Báo giá"
                icon={<Icon color="#fff" name="ios-calculator" size={20} />}
                buttonStyle={styles.actionButton}
                titleStyle={styles.actionButtonTitle}
                onPress={toggleAddAgencyToCartAndRedirect}
              />
              <Button
                title={info.phone}
                icon={<Icon color="#fff" name="ios-call" size={20} />}
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{
                  ...styles.actionButton,
                  backgroundColor: globalColorsAndStyles.color.secondary
                }}
                onPress={() => makeCall(info.phone)}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                title="Thêm sản phẩm"
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{
                  ...styles.actionButton,
                  backgroundColor: globalColorsAndStyles.color.secondary
                }}
                onPress={redirectToAddProductsForAgency}
              />
              <Button
                title="Xoá đại lý"
                icon={
                  <Icon
                    color="#fff"
                    name="ios-remove-circle-outline"
                    size={20}
                  />
                }
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{ ...styles.actionButton, backgroundColor: "red" }}
                onPress={() => makeCall(info.phone)}
              />
            </View>
          </View>
        </Card>
        <Text h3 style={{ textAlign: "center" }}>
          Sản phẩm
        </Text>
        {productsOfAgency &&
          ((productsOfAgency.loading && <Text h4>Đang tải</Text>) || (
            <View style={{ padding: 5 }}>
              <ProductItemContext.Provider
                value={{
                  type: appConstants.productItemContext.SHOW
                }}
              >
                <ProductList productIds={productsOfAgency.allIds} />
              </ProductItemContext.Provider>
            </View>
          ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  agencyInfo: {
    fontSize: 17
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20
  },
  actionButton: {
    width: 140
  },
  actionButtonTitle: {
    fontSize: 14
  }
});

export default connect(
  (state, props) => ({
    agency: selectors.data.getAgencyByIdFromNavigationParam(state, props),
    productsOfAgency: selectors.data.getProductsOfAgency(state, {
      id: props.navigation.getParam("id")
    })
  }),
  (dispatch, props) => ({
    toggleAddAgencyToCartAndRedirect: () => {
      const id = props.navigation.getParam("id");
      dispatch(
        actions.cart.addAgencyToCartIfNeeded(
          id,
          appConstants.productItemContext.QUOTATION
        )
      );
      props.navigation.navigate("CreateQuotation", { id });
    },
    redirectToAddProductsForAgency: () => {
      const id = props.navigation.getParam("id");
      dispatch(
        actions.cart.addAgencyToCartIfNeeded(
          id,
          appConstants.productItemContext.ADD_TO_AGENCY
        )
      );
      props.navigation.navigate("AddProductsForAgency", { id });
    },
    getAgencyProducts: () =>
      dispatch(
        actions.data.getAgencyProductsIfNeeded(props.navigation.getParam("id"))
      )
  })
)(AgencyDetail);

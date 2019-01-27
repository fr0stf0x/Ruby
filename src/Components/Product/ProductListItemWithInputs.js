import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import { CheckBox } from "react-native-elements";
import NumericInput from "react-native-numeric-input";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatMoney } from "~/Utils/utils";
import styles from "./productStyles";
import types from "~/Actions/ActionTypes";

class ProductListItemWithInputs extends Component {
  toggleCheck = () => {
    const { dispatch, id, endpoint } = this.props;
    dispatch(actions.cart.toggleCheckProduct({ id, endpoint }));
  };

  inputChange = change => {
    const { dispatch, id, endpoint, status } = this.props;
    const otherChangeName =
      change.name === "offPercent" ? "price" : "offPercent";
    const otherChangeValue =
      change.name === "offPercent"
        ? ((100 - change.value) * status.price.default) / 100
        : Math.round((1 - change.value / status.price.default) * 100 * 100) /
          100;
    const otherChange = {
      name: otherChangeName,
      value: otherChangeValue
    };
    dispatch(actions.cart.modifyItemInCart(id, endpoint, change));
    dispatch(actions.cart.modifyItemInCart(id, endpoint, otherChange));
  };

  changeCount = count => {
    const { dispatch, productInCart, status, id, endpoint } = this.props;
    const currentPrice = status.price.current || status.price.default;
    const price = (productInCart && productInCart.price) || currentPrice;
    const change = {
      name: "count",
      value: count
    };
    const totalPrice = price * count;
    const priceChange = {
      name: "totalPrice",
      value: totalPrice
    };
    dispatch(actions.cart.modifyItemInCart(id, endpoint, change));
    dispatch(actions.cart.modifyItemInCart(id, endpoint, priceChange));
  };

  render() {
    const { detail, endpoint, status, index, productInCart } = this.props;
    const currentPrice = status.price.current || status.price.default;
    const currentOffPercent =
      status.off_percent.current || status.off_percent.default;

    const checked = Boolean(productInCart && productInCart.checked);
    const price = (productInCart && productInCart.price) || currentPrice;
    const offPercent =
      (productInCart && productInCart.offPercent) || currentOffPercent;
    const count = (productInCart && productInCart.count) || 10;
    const totalPrice = count * price;

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles(index, status.available).listItem}>
          <View style={styles().imageContainer}>
            <Image
              source={{
                uri: detail.localImage || detail.imageUrl
              }}
              resizeMode="cover"
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles().infoAndActions}>
            <View style={[styles().info, { flex: 1, alignContent: "center" }]}>
              <Text style={styles().listItemTitle}>{detail.name}</Text>
              {endpoint === appConstants.productItemContext.QUOTATION &&
                checked && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center"
                    }}
                  >
                    <NumericInput
                      type="up-down"
                      initValue={offPercent}
                      onChange={offPercent =>
                        this.inputChange({
                          name: "offPercent",
                          value: offPercent
                        })
                      }
                      minValue={0}
                      maxValue={100}
                      totalWidth={90}
                      totalHeight={40}
                      iconSize={20}
                      valueType="real"
                      step={0.5}
                      rounded
                      textColor="#B0228C"
                      iconStyle={{ color: "white" }}
                      upDownButtonsBackgroundColor="#EA3788"
                    />
                    <NumericInput
                      type="up-down"
                      initValue={price}
                      onChange={price =>
                        this.inputChange({ name: "price", value: price })
                      }
                      minValue={0}
                      totalWidth={90}
                      totalHeight={40}
                      iconSize={20}
                      step={500}
                      rounded
                      textColor="#B0228C"
                      iconStyle={{ color: "white" }}
                      upDownButtonsBackgroundColor="#EA3788"
                    />
                  </View>
                )}
              {endpoint === appConstants.productItemContext.ORDER && checked && (
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <NumericInput
                    type="up-down"
                    initValue={count}
                    onChange={this.changeCount}
                    minValue={1}
                    totalWidth={90}
                    totalHeight={40}
                    iconSize={20}
                    rounded
                    textColor="#B0228C"
                    iconStyle={{ color: "white" }}
                    upDownButtonsBackgroundColor="#EA3788"
                  />
                  <Text style={{ paddingStart: 10 }}>
                    {formatMoney(totalPrice)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{ alignSelf: "center" }}>
          <CheckBox
            containerStyle={{ padding: 0 }}
            checkedIcon="dot-circle-o"
            uncheckedColor={globalColorsAndStyles.color.primaryText}
            uncheckedIcon="circle-o"
            checked={checked}
            onPress={this.toggleCheck}
          />
        </View>
      </View>
    );
  }
}

export default connect((state, props) => {
  const product = selectors.cart.getProductInCart(state, props);
  return {
    productInCart: product
  };
})(ProductListItemWithInputs);

import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { CheckBox, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { randomProductImage } from "~/Utils/utils";
import NumericInput from "react-native-numeric-input";

export const ProductItemContext = React.createContext(
  appConstants.productItemContext.SHOW
);

const styles = (key, available) =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      flex: 1,
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: available
        ? key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
        : "gray"
    },
    listItemTitle: {
      fontSize: 20,
      color: globalColorsAndStyles.color.primaryText
    },
    imageContainer: {
      alignSelf: "center"
    },
    infoAndActions: {
      flex: 1,
      flexDirection: "row"
    },
    info: {
      paddingLeft: 20,
      alignSelf: "center"
    },
    actions: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 20
    }
  });

const ProductInfoAndActions = connect((state, props) => {
  const product = selectors.cart.getProductInCart(state, props);
  return {
    productInCart: product
  };
})(({ id, detail, endpoint, status, index, productInCart, dispatch }) => {
  const currentPrice = status.price.current || status.price.default;
  const currentOffPercent =
    status.off_percent.current || status.off_percent.default;
  let price, offPercent, checked;
  checked = Boolean(productInCart && productInCart.checked);
  price = (productInCart && productInCart.price) || currentPrice;
  offPercent = (productInCart && productInCart.offPercent) || currentOffPercent;

  const toggleCheck = () => {
    dispatch(actions.cart.toggleCheckProduct({ id, endpoint }));
  };

  const inputChange = change => {
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
    console.log(otherChange);
    dispatch(actions.cart.modifyItemInCart(id, endpoint, change));
    dispatch(actions.cart.modifyItemInCart(id, endpoint, otherChange));
  };

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles(index, status.available).listItem}>
        <View style={styles().imageContainer}>
          <Image
            source={randomProductImage()}
            resizeMode="cover"
            style={{ width: 80, height: 130 }}
          />
        </View>
        <View style={styles().infoAndActions}>
          <View style={[styles().info, { flex: 1, alignContent: "center" }]}>
            <Text style={styles().listItemTitle}>{detail.name}</Text>
            {endpoint === appConstants.productItemContext.QUOTATION && (
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                {/* <Input
                  keyboardType="decimal-pad"
                  value={offPercent.toString()}
                  editable={Boolean(checked)}
                  onChangeText={offPercent =>
                    inputChange({ name: "offPercent", value: offPercent })
                  }
                />
                <Input
                  keyboardType="decimal-pad"
                  value={price.toString()}
                  editable={Boolean(checked)}
                  onChangeText={price =>
                    inputChange({ name: "price", value: price })
                  }
                /> */}
                {checked && (
                  <NumericInput
                    type="up-down"
                    initValue={offPercent}
                    value={offPercent}
                    onChange={offPercent =>
                      inputChange({ name: "offPercent", value: offPercent })
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
                )}
                {checked && (
                  <NumericInput
                    type="up-down"
                    initValue={price}
                    value={price}
                    onChange={price =>
                      inputChange({ name: "price", value: price })
                    }
                    maxValue={status.price.default}
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
                )}
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
          onPress={toggleCheck}
        />
      </View>
    </View>
  );
});

const ReadOnlyProduct = ({ id, detail, status, navigation, index }) => {
  return (
    <View style={styles(index, status.available).listItem}>
      <View style={styles().imageContainer}>
        <Image
          source={randomProductImage()}
          resizeMode="cover"
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={styles().infoAndActions}>
        <View style={styles().info}>
          <Text style={styles().listItemTitle}>{detail.name}</Text>
          <Text>{detail.type}</Text>
        </View>
        <View style={styles().actions}>
          <Icon
            name="ios-arrow-forward"
            size={20}
            onPress={() => navigation.navigate("ProductDetail", { id })}
          />
        </View>
      </View>
    </View>
  );
};

const ProductItem = ({ item: { id, detail, status }, index }) => {
  return (
    <ProductItemContext.Consumer>
      {context =>
        context.type === appConstants.productItemContext.SHOW ? (
          <ReadOnlyProduct
            key={index}
            index={index}
            id={id}
            status={status}
            detail={detail}
            navigation={context.action.navigation}
          />
        ) : (
          <ProductInfoAndActions
            key={index}
            index={index}
            id={id}
            detail={detail}
            status={status}
            endpoint={context.type}
          />
        )
      }
    </ProductItemContext.Consumer>
  );
};

const ProductList = ({ products, type }) => {
  if (products) {
    const { allIds, byId } = products;
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={allIds.map(id => mergeObj(byId[id], { id }))}
        renderItem={ProductItem}
      />
    );
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 16, color: globalColorsAndStyles.color.error }}>
        Không có sản phẩm
        <Text>{type === "available" ? " có sẵn " : " không có sẵn "}</Text>
        nào
      </Text>
    </View>
  );
};

export default connect((state, props) => ({
  products: selectors.data.getProductsByType(state, props)
}))(ProductList);

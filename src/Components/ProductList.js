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
    checked: product && product.checked
  };
})(({ id, detail, endpoint, status, index, checked, dispatch }) => {
  const price = status.price.current || status.price.default;
  const offPercent = status.off_percent.current || status.off_percent.default;

  const toggleCheck = () => {
    dispatch(actions.cart.toggleCheckProduct({ id, endpoint }));
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
              <View style={{ flex: 1 }}>
                <Input
                  value={offPercent.toString()}
                  editable={Boolean(checked)}
                />
                <Input value={price.toString()} editable={Boolean(checked)} />
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

const ProductList = ({ products: { allIds, byId } }) => (
  <FlatList
    keyExtractor={(item, index) => index.toString()}
    data={allIds.map(id => mergeObj(byId[id], { id }))}
    renderItem={ProductItem}
  />
);

export default connect((state, props) => ({
  products: selectors.data.getProductsByType(state, props)
}))(ProductList);

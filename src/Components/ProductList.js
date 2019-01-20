import React from "react";
import { Image, FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import appConstants from "~/appConstants";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import ProductListItemWithInputs from "./Product/ProductListItemWithInputs";
import ReadOnlyProductListItem from "./Product/ReadOnlyProductListItem";

export const ProductItemContext = React.createContext(
  appConstants.productItemContext.SHOW
);

const ProductItem = ({ item: { id, detail, status }, index }) => {
  return (
    <ProductItemContext.Consumer>
      {context =>
        context.type === appConstants.productItemContext.SHOW ? (
          <TouchableOpacity
            onPress={() =>
              context.action
                ? context.action.navigation.navigate("ProductDetail", { id })
                : {}
            }
          >
            <ReadOnlyProductListItem
              id={id}
              key={index}
              index={index}
              status={status}
              detail={detail}
            />
          </TouchableOpacity>
        ) : (
          <ProductListItemWithInputs
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

const ProductList = ({ productIds, productDetailsById }) => {
  if (productIds && productIds.length > 0) {
    return (
      <FlatList
        contentContainerStyle={{ paddingVertical: 10 }}
        refreshing={true}
        keyExtractor={(item, index) => index.toString()}
        data={productIds.map(id => mergeObj(productDetailsById[id], { id }))}
        renderItem={ProductItem}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text style={{ fontSize: 24, color: globalColorsAndStyles.color.error }}>
        <Text>Không có sản phẩm nào</Text>
      </Text>
    </View>
  );
};

export default connect(state => ({
  productDetailsById: selectors.data.getProducts(state).byId
}))(ProductList);

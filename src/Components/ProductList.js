import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
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
              context.action.navigation.navigate("ProductDetail", { id })
            }
          >
            <ReadOnlyProductListItem
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

const ProductList = ({ products, type }) => {
  if (products) {
    const { allIds, byId, loading } = products;
    return (
      (loading && <Text h1>Đang tải</Text>) || (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={allIds.map(id => mergeObj(byId[id], { id }))}
          renderItem={ProductItem}
        />
      )
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

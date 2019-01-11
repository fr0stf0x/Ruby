import React, { Component } from "react";
import { StyleSheet, Image, FlatList, Text, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { formatDate, randomProductImage, formatDateTime } from "~/Utils/utils";
import { mergeObj } from "~/Reducers/utils";
import { globalColorsAndStyles } from "~/Theme";

class QuotationDetail extends Component {
  render() {
    const { quotation, allProducts } = this.props;
    const { createdAt, products: productsOfQuotation } = quotation.detail;
    const formatedDate = formatDateTime(createdAt);
    const { byId } = allProducts;

    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={Object.keys(productsOfQuotation).map(id =>
          mergeObj(byId[id], { id, inQuotation: productsOfQuotation[id] })
        )}
        renderItem={ReadOnlyProduct}
      />
    );
  }
}

const ReadOnlyProduct = ({ item: { id, detail, inQuotation }, index }) => {
  return (
    <View style={styles(index).listItem}>
      <View style={styles().imageContainer}>
        <Image
          source={randomProductImage()}
          resizeMode="cover"
          style={{ width: 100, height: 100 }}
        />
      </View>
      {detail && (
        <View style={styles().infoAndActions}>
          <View style={styles().info}>
            <Text style={styles().listItemTitle}>{detail.name}</Text>
            <Text>{detail.type}</Text>
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Text>{inQuotation.price}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = key =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      flex: 1,
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor:
        key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
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

export default connect((state, props) => ({
  quotation: selectors.data.getQuotationByIdFromNavigationParam(state, props),
  allProducts: selectors.data.getProductsByType(state, { type: "available" })
}))(QuotationDetail);

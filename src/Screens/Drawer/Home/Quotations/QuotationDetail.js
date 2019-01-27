import React, { Component } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { connect } from "react-redux";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime } from "~/Utils/utils";

class QuotationDetail extends Component {
  render() {
    const { quotation, allProducts, agencyDetailById } = this.props;
    const { createdAt, products: quotatedProducts, to } = quotation.detail;
    const { byId } = allProducts;
    const formatedDate = formatDate(createdAt);
    const formatedTime = formatTime(createdAt);

    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 24 }}>
            {(quotation.type === "received" &&
              `Báo giá ngày ${formatedDate}`) ||
              `Báo giá đến ${agencyDetailById(to).detail.info.name}`}
          </Text>
          <Text style={{ fontSize: 18 }}>
            {quotation.type === "received"
              ? `Đã nhận: ${formatedTime}`
              : `Đã gởi: ${formatedTime}, ${formatedDate}`}
          </Text>
          {quotation.type === "going" && (
            <Text style={{ fontSize: 18, fontStyle: "italic" }}>
              {agencyDetailById(to).detail.info.name}
              {quotation.detail.status.verified
                ? " đã xác nhận"
                : " chưa xác nhận"}
            </Text>
          )}
        </View>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          keyExtractor={(item, index) => index.toString()}
          data={Object.entries(quotatedProducts)
            .filter(([id, value]) => value.checked)
            .map(([id]) =>
              mergeObj(byId[id], { id, inQuotation: quotatedProducts[id] })
            )}
          renderItem={ReadOnlyProduct}
        />
      </View>
    );
  }
}

const ReadOnlyProduct = ({ item: { id, detail, inQuotation }, index }) => {
  return (
    <View style={styles(index).listItem}>
      <View style={styles().imageContainer}>
        <Image
          source={{ uri: detail.localImage || detail.imageUrl }}
          resizeMode="cover"
          style={{ width: 100, height: 100 }}
        />
      </View>
      {detail && (
        <View style={styles().infoAndActions}>
          <View style={styles().info}>
            <Text style={styles().listItemTitle}>
              {detail.name} - {detail.type}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text>Giá mới {inQuotation.price}</Text>
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
  allProducts: selectors.data.getProducts(state),
  agencyDetailById: id => selectors.data.getAgencyById(state, { id })
}))(QuotationDetail);

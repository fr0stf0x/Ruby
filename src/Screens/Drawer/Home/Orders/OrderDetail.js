import React, { Component } from "react";
import { StyleSheet, FlatList, Image, Text, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime, formatMoney } from "~/Utils/utils";
import { mergeObj } from "~/Reducers/utils";

class OrderDetail extends Component {
  render() {
    const { order, allProducts } = this.props;
    const { detail, type } = order;
    const { createdAt, products: orderedProducts, totalPrice } = detail;
    const { byId } = allProducts;
    const formatedDate = formatDate(createdAt);
    const formatedTime = formatTime(createdAt);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 24 }}>
            {type === "received"
              ? `Đơn đặt hàng từ ${order.from}`
              : `Đơn đặt hàng ngày ${formatedDate}`}
          </Text>
          <Text style={{ fontSize: 18 }}>
            Đã {(type === "received" && "nhận") || "gởi"}:{formatedDate},{" "}
            {formatedTime}
          </Text>
          <Text style={{ fontSize: 18 }}>
            Tổng số tiền: {formatMoney(totalPrice)}
          </Text>
        </View>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(orderedProducts).map(id =>
            mergeObj(byId[id], { ordered: orderedProducts[id] })
          )}
          renderItem={ReadOnlyProduct}
        />
      </View>
    );
  }
}

const ReadOnlyProduct = ({ item: { detail, ordered }, index }) => {
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
              {detail.name} - <Text>{detail.type}</Text>
            </Text>
            <Text>Số lượng: {ordered.count}</Text>
            <Text>Tổng tiền: {formatMoney(ordered.totalPrice)}</Text>
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
  order: selectors.data.getOrderByIdFromNavigationParam(state, props),
  allProducts: selectors.data.getProducts(state)
}))(OrderDetail);

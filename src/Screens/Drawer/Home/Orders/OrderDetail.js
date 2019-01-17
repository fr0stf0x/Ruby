import React, { Component } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime } from "~/Utils/utils";

class OrderDetail extends Component {
  render() {
    const { order, allProducts } = this.props;
    const { createdAt, orderedProducts } = order.detail;
    const { byId } = allProducts;
    const formatedDate = formatDate(createdAt);
    const formatedTime = formatTime(createdAt);

    return (
      <View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 24 }}>Đơn đặt hàng từ {order.from}</Text>
          <Text style={{ fontSize: 18 }}>
            Đã nhận: {formatedDate}, {formatedTime}
          </Text>
        </View>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          keyExtractor={(item, index) => index.toString()}
          data={Object.keys(orderedProducts).map(id => byId[id])}
          renderItem={ReadOnlyProduct}
        />
      </View>
    );
  }
}

const ReadOnlyProduct = ({ item: { detail }, index }) => {
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
            <Text style={styles().listItemTitle}>{detail.name}</Text>
            <Text>{detail.type}</Text>
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

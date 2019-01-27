import React, { Component } from "react";
import {
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime, formatMoney } from "~/Utils/utils";
import AcceptAndRejectButtons from "./AcceptAndRejectButtons";
import NewItemBadge from "./NewItemBadge";
import { mergeObj } from "~/Reducers/utils";
import { Text } from "react-native-elements";

class OrderList extends Component {
  render() {
    const { orders, acceptNewOrder, rejectNewOrder, goToDetail } = this.props;
    if (orders.allIds && orders.allIds.length > 0) {
      const { allIds, byId, loading } = orders;
      return (
        (loading && <Text h1>Đang tải</Text>) || (
          <FlatList
            contentContainerStyle={{ paddingVertical: 10 }}
            refreshing={true}
            keyExtractor={item => item.id}
            data={allIds
              .sort((id1, id2) =>
                byId[id2].detail && byId[id1].detail
                  ? byId[id2].detail.createdAt - byId[id1].detail.createdAt
                  : 1
              )
              .map(id =>
                mergeObj(byId[id], {
                  id,
                  goToDetail,
                  onAccept: () =>
                    promiseWithLoadingAnimation(() =>
                      acceptNewOrder(byId[id].detail.from, id).then(() =>
                        Alert.alert("Thành công")
                      )
                    ),
                  onReject: () =>
                    promiseWithLoadingAnimation(() =>
                      rejectNewOrder(byId[id].detail.from, id).then(() =>
                        Alert.alert("Đã từ chối")
                      )
                    )
                })
              )}
            renderItem={OrderItem}
          />
        )
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
        <Text
          style={{ fontSize: 24, color: globalColorsAndStyles.color.error }}
        >
          Không có đơn đặt hàng nào
        </Text>
      </View>
    );
  }
}

const OrderItem = ({
  item: { id, status, from, type, detail, goToDetail, onAccept, onReject },
  index
}) => {
  if (detail) {
    const formatedDate = formatDate(detail.createdAt);
    const formatedTime = formatTime(detail.createdAt);
    return (
      <TouchableOpacity key={index} onPress={() => goToDetail(id)}>
        <View style={styles(index, !detail.status.verified).listItem}>
          <View style={styles().infoAndActions}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles().info}>
                <Text style={styles().listItemTitle}>
                  {!detail.status.verified && <NewItemBadge />}
                  {type === "received"
                    ? `Đơn đặt hàng từ ${from}`
                    : `Đơn đặt hàng ngày ${formatedDate}`}
                </Text>
                {!detail.status.verified && (
                  <View style={{ alignItems: "center" }}>
                    {type === "received" && (
                      <AcceptAndRejectButtons
                        onAccept={onAccept}
                        onReject={onReject}
                      />
                    )}
                  </View>
                )}
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles().listItemSubtitle}>
                    <Text>{formatMoney(detail.totalPrice)}</Text> -{" "}
                    {formatedTime}, {formatedDate}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles().actions}>
              <Icon name="ios-arrow-forward" size={24} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <Text key={index} h1>
        Đang tải
      </Text>
    );
  }
};

const styles = (key, isNew) =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      flex: 1,
      flexDirection: "row",
      padding: 5,
      margin: 10,
      backgroundColor: !isNew
        ? key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
        : "#e8e676"
    },
    listItemTitle: {
      fontSize: 18,
      color: globalColorsAndStyles.color.primaryText
    },
    listItemSubtitle: {
      fontSize: 16,
      fontStyle: "italic",
      alignSelf: "center"
    },
    imageContainer: {
      alignSelf: "center"
    },
    infoAndActions: {
      flex: 1,
      flexDirection: "row"
    },
    info: {
      flex: 1,
      paddingLeft: 20,
      alignSelf: "center",
      flexDirection: "column"
    },
    actions: {
      width: 50,
      alignItems: "flex-end",
      justifyContent: "center",
      paddingRight: 20
    }
  });

export default connect(
  state => ({
    orders: selectors.data.getOrders(state)
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("OrderDetail", { id }),
    acceptNewOrder: (fromId, orderId) =>
      dispatch(actions.data.acceptNewOrder(fromId, orderId)),
    rejectNewOrder: (fromId, orderId) =>
      dispatch(actions.data.rejectNewOrder(fromId, orderId))
  })
)(OrderList);

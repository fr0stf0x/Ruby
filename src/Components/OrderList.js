import React, { Component } from "react";
import {
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime } from "~/Utils/utils";
import AcceptAndRejectButtons from "./AcceptAndRejectButtons";
import NewItemBadge from "./NewItemBadge";

class OrderList extends Component {
  render() {
    const {
      agencies,
      orders,
      acceptNewOrder,
      rejectNewOrder,
      goToDetail
    } = this.props;
    if (orders && orders.allIds.length > 0) {
      const { allIds, byId, loading } = orders;
      return (
        (loading && <Text h1>Đang tải</Text>) || (
          <FlatList
            contentContainerStyle={{ paddingVertical: 10 }}
            refreshing={true}
            keyExtractor={item => item.id}
            data={allIds
              .sort(
                (id1, id2) =>
                  byId[id2].detail.createdAt - byId[id1].detail.createdAt
              )
              .map(id => {
                const { from, products, detail, status } = byId[id];
                return {
                  id,
                  agencyId: from,
                  agencyName: agencies.byId[from].detail.info.name,
                  status,
                  detail,
                  products,
                  goToDetail,
                  onAccept: () =>
                    promiseWithLoadingAnimation(() =>
                      acceptNewOrder(from, id).then(() =>
                        Alert.alert("Thành công")
                      )
                    ),
                  onReject: () =>
                    promiseWithLoadingAnimation(() =>
                      rejectNewOrder(from, id).then(() =>
                        Alert.alert("Đã từ chối")
                      )
                    )
                };
              })}
            renderItem={OrderItem}
          />
        )
      );
    }
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{ fontSize: 16, color: globalColorsAndStyles.color.error }}
        >
          Không có đơn đặt hàng nào
        </Text>
      </View>
    );
  }
}

const OrderItem = ({
  item: {
    id,
    status,
    agencyId,
    agencyName,
    detail,
    goToDetail,
    onAccept,
    onReject
  },
  index
}) => {
  const formatedDate = formatDate(detail.createdAt);
  const formatedTime = formatTime(detail.createdAt);
  return (
    <TouchableOpacity onPress={() => goToDetail(id)}>
      <View style={styles(index, !status.verified).listItem}>
        <View style={styles().infoAndActions}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles().info}>
              <Text style={styles().listItemTitle}>
                {!status.verified && <NewItemBadge />}
                Đơn đặt hàng từ {agencyName}
              </Text>
              {!status.verified && (
                <View style={{ alignItems: "center" }}>
                  <AcceptAndRejectButtons
                    onAccept={() => onAccept(agencyId)}
                    onReject={() => onReject(agencyId)}
                  />
                </View>
              )}
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles().listItemSubtitle}>
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
    orders: selectors.data.getOrders(state),
    agencies: selectors.data.getAgencies(state)
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("OrderDetail", { id }),
    acceptNewOrder: (fromId, orderId) =>
      dispatch(actions.data.acceptNewOrder(fromId, orderId)),
    rejectNewOrder: (fromId, orderId) =>
      dispatch(actions.data.rejectNewOrder(fromId, orderId))
  })
)(OrderList);

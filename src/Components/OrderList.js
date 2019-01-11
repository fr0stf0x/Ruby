import React, { Component } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate } from "~/Utils/utils";

class OrderList extends Component {
  render() {
    const {
      agencies,
      orders,
      acceptNewOrder,
      goToDetail,
      rejectNewOrder,
      toggleLoading
    } = this.props;
    if (orders) {
      console.log(orders);
      const { allIds, byId } = orders;
      return (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={allIds.map(id => {
            const { from, products } = byId[id];
            return {
              id,
              agencyName: agencies.byId[from].detail.info.name,
              products,
              goToDetail,
              onAccept: fromId => {
                toggleLoading();
                acceptNewOrder(fromId, id)
                  .then(() => {
                    Alert.alert("Thành công");
                  })
                  .finally(toggleLoading);
              },
              onReject: fromId => {
                toggleLoading();
                rejectNewOrder(fromId, id)
                  .then(() => {
                    Alert.alert("Thành công");
                  })
                  .finally(toggleLoading);
              }
            };
          })}
          renderItem={OrderItem}
        />
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
  item: { id, status, from, detail, goToDetail, onAccept, onReject },
  index
}) => {
  const formatedDateTime = formatedDateTime(detail.createdAt);
  return (
    <View style={styles(index, !status.verified).listItem}>
      <View style={styles().infoAndActions}>
        <View style={styles().info}>
          <Text style={styles().listItemTitle}>From {from}</Text>
          <Text>{formatedDateTime}</Text>
        </View>
        {!status.verified && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: globalColorsAndStyles.color.primary
              }}
              onPress={() => onAccept(from)}
            >
              <Icon size={20} name="ios-checkmark" />
              <Text>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onReject(from)}
              style={{
                flexDirection: "row",
                backgroundColor: globalColorsAndStyles.color.error
              }}
            >
              <Icon size={20} name="ios-remove-circle-outline" />
              <Text>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles().actions}>
          <Icon
            name="ios-arrow-forward"
            size={20}
            onPress={() => goToDetail(id)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = (key, isNew) =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      flex: 1,
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: isNew
        ? key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
        : "#e8e676"
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

export default connect(
  state => ({
    orders: selectors.data.getOrders(state),
    agencies: selectors.data.getAgencies(state)
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("OrderDetail", { id }),
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    acceptNewOrder: (fromId, orderId) =>
      dispatch(actions.data.acceptNewOrder(fromId, orderId)),
    rejectNewOrder: (fromId, orderId) =>
      dispatch(actions.data.rejectNewOrder(fromId, orderId))
  })
)(OrderList);

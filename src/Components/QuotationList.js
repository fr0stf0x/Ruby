import React, { Component } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime } from "~/Utils/utils";
import AcceptAndRejectButtons from "./AcceptAndRejectButtons";
import NewItemBadge from "./NewItemBadge";
import { Text } from "react-native-elements";

class QuotationList extends Component {
  render() {
    const {
      agencyDetailById,
      goToDetail,
      quotations,
      acceptNewQuotation,
      rejectNewQuotation
    } = this.props;
    if (quotations.allIds && quotations.allIds.length > 0) {
      const { allIds, byId, loading } = quotations;
      return (
        (loading && <Text h1>Đang tải</Text>) || (
          <FlatList
            contentContainerStyle={{ paddingVertical: 10 }}
            refreshing={true}
            keyExtractor={item => item.id}
            data={allIds
              .sort(
                (id1, id2) =>
                  byId[id2].detail &&
                  byId[id1].detail &&
                  byId[id2].detail.createdAt - byId[id1].detail.createdAt
              )
              .map(id =>
                mergeObj(byId[id], {
                  id,
                  agencyDetailById,
                  goToDetail,
                  onAccept: () =>
                    promiseWithLoadingAnimation(() =>
                      acceptNewQuotation(id).then(() =>
                        Alert.alert("Thành công")
                      )
                    ),
                  onReject: () =>
                    promiseWithLoadingAnimation(() =>
                      rejectNewQuotation(id).then(() =>
                        Alert.alert("Đã từ chối")
                      )
                    )
                })
              )}
            renderItem={QuotationListItem}
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
          Không có báo giá nào
        </Text>
      </View>
    );
  }
}

const QuotationListItem = ({
  item: {
    id,
    status,
    detail,
    agencyDetailById,
    type,
    onAccept,
    onReject,
    goToDetail
  },
  index
}) => {
  let formatedTime, formatedDate;
  if (detail) {
    formatedDate = formatDate(detail.createdAt);
    formatedTime = formatTime(detail.createdAt);

    return (
      <TouchableOpacity onPress={() => goToDetail(id)}>
        <View style={styles(index, !detail.status.verified).listItem}>
          <View style={styles().infoAndActions}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={styles().info}>
                <Text style={styles().listItemTitle}>
                  {!detail.status.verified && <NewItemBadge />}
                  {type === "received"
                    ? "Báo giá ngày " + formatedDate
                    : "Báo giá đến " +
                      agencyDetailById(detail.to).detail.info.name}
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
                <View style={styles().timeContainer}>
                  <Text>
                    {detail.status.verified ? "Đã xác nhận" : "Chưa xác nhận"}
                  </Text>
                  <Text style={styles().listItemSubtitle}>{formatedTime}</Text>
                </View>
              </View>
              <View style={styles().actions}>
                <Icon name="ios-arrow-forward" size={24} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return <Text h1>Đang tải</Text>;
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
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
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
      flexDirection: "column",
      alignSelf: "center"
    },
    actions: {
      width: 50,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 20
    }
  });

export default connect(
  state => ({
    quotations: selectors.data.getQuotations(state),
    agencyDetailById: id => selectors.data.getAgencyById(state, { id })
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("QuotationDetail", { id }),
    acceptNewQuotation: quotationId =>
      dispatch(actions.data.acceptNewQuotation(quotationId)),
    rejectNewQuotation: quotationId =>
      dispatch(actions.data.rejectNewQuotation(quotationId))
  })
)(QuotationList);

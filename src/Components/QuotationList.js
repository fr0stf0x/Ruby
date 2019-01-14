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
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate, formatTime } from "~/Utils/utils";
import AcceptAndRejectButtons from "./AcceptAndRejectButtons";
import NewItemBadge from "./NewItemBadge";

class QuotationList extends Component {
  render() {
    const {
      goToDetail,
      quotations,
      acceptNewQuotation,
      rejectNewQuotation
    } = this.props;
    if (quotations && !quotations.empty) {
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
                  byId[id2].detail.createdAt - byId[id1].detail.createdAt
              )
              .map(id =>
                mergeObj(byId[id], {
                  id,
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{ fontSize: 16, color: globalColorsAndStyles.color.error }}
        >
          Không có báo giá nào
        </Text>
      </View>
    );
  }
}

const QuotationListItem = ({
  item: { id, status, detail, onAccept, onReject, goToDetail },
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
                Báo giá ngày {formatedDate}
              </Text>
              {!status.verified && (
                <View style={{ alignItems: "center" }}>
                  <AcceptAndRejectButtons
                    onAccept={() => onAccept(id)}
                    onReject={() => onReject(id)}
                  />
                </View>
              )}
              <View style={styles().timeContainer}>
                <Text style={styles().listItemSubtitle}>{formatedTime}</Text>
              </View>
            </View>
            <View style={styles().actions}>
              <Icon
                name="ios-arrow-forward"
                size={24}
                onPress={() => goToDetail(id)}
              />
            </View>
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
    timeContainer: {
      flexDirection: "row-reverse"
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
    quotations: selectors.data.getQuotations(state)
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("QuotationDetail", { id }),
    acceptNewQuotation: quotationId =>
      dispatch(actions.data.acceptNewQuotation(quotationId)),
    rejectNewQuotation: quotationId =>
      dispatch(actions.data.rejectNewQuotation(quotationId))
  })
)(QuotationList);

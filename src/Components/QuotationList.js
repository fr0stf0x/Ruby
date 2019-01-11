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

class QuotationList extends Component {
  render() {
    const {
      goToDetail,
      quotations,
      toggleLoading,
      acceptNewQuotation,
      rejectNewQuotation
    } = this.props;
    if (quotations) {
      const { allIds, byId } = quotations;
      return (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={allIds.map(id =>
            mergeObj(byId[id], {
              id,
              goToDetail,
              onAccept: () => {
                toggleLoading();
                acceptNewQuotation(id)
                  .then(() => {
                    Alert.alert("Thành công");
                  })
                  .finally(toggleLoading);
              },
              onReject: () => {
                toggleLoading();
                rejectNewQuotation(id)
                  .then(() => {
                    Alert.alert("Thành công");
                  })
                  .finally(toggleLoading);
              }
            })
          )}
          renderItem={Quotation}
        />
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

const Quotation = ({
  item: { id, status, detail, onAccept, onReject, goToDetail },
  index
}) => {
  const formatedDateTime = formatedDateTime(detail.createdAt);
  return (
    <View style={styles(index, !status.verified).listItem}>
      <View style={styles().infoAndActions}>
        <View style={styles().info}>
          <Text style={styles().listItemTitle}>Báo giá</Text>
          <Text>{formatedDateTime}</Text>
        </View>
        {!status.verified && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end"
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: globalColorsAndStyles.color.primary
              }}
              onPress={onAccept}
            >
              <Icon size={20} name="ios-checkmark" />
              <Text>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onReject}
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
        : "gray"
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
    quotations: selectors.data.getQuotations(state)
  }),
  (dispatch, props) => ({
    goToDetail: id => props.navigation.navigate("QuotationDetail", { id }),
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    acceptNewQuotation: quotationId =>
      dispatch(actions.data.acceptNewQuotation(quotationId)),
    rejectNewQuotation: quotationId =>
      dispatch(actions.data.rejectNewQuotation(quotationId))
  })
)(QuotationList);

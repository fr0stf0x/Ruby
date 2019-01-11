import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { Card, Button } from "react-native-elements";
import { globalColorsAndStyles } from "~/Theme";
import { randomAgencyImage, makeCall } from "~/Utils/utils";
import actions from "~/Actions";
import Icon from "react-native-vector-icons/Ionicons";
import appConstants from "~/appConstants";

class AgencyDetail extends Component {
  render() {
    const { agency, toggleAddAgencyToCartAndRedirect } = this.props;
    const { info } = agency.detail;
    return (
      <View>
        <Card
          containerStyle={globalColorsAndStyles.style.boxShadow}
          title={info.name}
          image={randomAgencyImage()}
        >
          <View>
            <View
              style={{
                height: 200,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text style={styles.agencyInfo}>{info.address}</Text>
              <Text style={styles.agencyInfo}>{info.phone}</Text>
              <Text style={styles.agencyInfo}>
                {info.type === appConstants.groupType.AGENCY
                  ? "Đại lý"
                  : "Nhà bán lẻ"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                title="Báo giá"
                icon={<Icon color="#fff" name="ios-calculator" size={20} />}
                buttonStyle={styles.actionButton}
                titleStyle={styles.actionButtonTitle}
                onPress={toggleAddAgencyToCartAndRedirect}
              />
              <Button
                title={info.phone}
                icon={<Icon color="#fff" name="ios-call" size={20} />}
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{
                  ...styles.actionButton,
                  backgroundColor: globalColorsAndStyles.color.secondary
                }}
                onPress={() => makeCall(info.phone)}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                title="Thêm sản phẩm"
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{
                  ...styles.actionButton,
                  backgroundColor: globalColorsAndStyles.color.secondary
                }}
                onPress={toggleAddAgencyToCartAndRedirect}
              />
              <Button
                title="Xoá đại lý"
                icon={
                  <Icon
                    color="#fff"
                    name="ios-remove-circle-outline"
                    size={20}
                  />
                }
                titleStyle={styles.actionButtonTitle}
                buttonStyle={{ ...styles.actionButton, backgroundColor: "red" }}
                onPress={() => makeCall(info.phone)}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  agencyInfo: {
    fontSize: 16
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 20
  },
  actionButton: {
    width: 140
  },
  actionButtonTitle: {
    fontSize: 14
  }
});

export default connect(
  (state, props) => ({
    agency: selectors.data.getAgencyByIdFromNavigationParam(state, props)
  }),
  (dispatch, props) => ({
    toggleAddAgencyToCartAndRedirect: () => {
      const id = props.navigation.getParam("id");
      console.log("id", id);
      dispatch(
        actions.cart.addAgencyToCartIfNeeded(
          id,
          appConstants.productItemContext.ADD_TO_AGENCY
        )
      );
      props.navigation.navigate("SelectProducts", { id });
    }
  })
)(AgencyDetail);

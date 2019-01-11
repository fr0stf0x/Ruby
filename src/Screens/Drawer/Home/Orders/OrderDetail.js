import React, { Component } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { formatDate } from "~/Utils/utils";

class OrderDetail extends Component {
  render() {
    const { order } = this.props;
    const formatedDate = formatDate(order.detail.createdAt);
    return (
      <View>
        <Text>{formatedDate} </Text>
      </View>
    );
  }
}

export default connect((state, props) => ({
  order: selectors.data.getOrderByIdFromNavigationParam(state, props)
}))(OrderDetail);

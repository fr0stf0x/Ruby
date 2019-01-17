import React, { Component } from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import QuotationList from "~/Components/QuotationList";
import selectors from "~/Selectors";
import store from "~/configureStore";
import appConstants from "~/appConstants";
import AccessDenied from "~/Screens/AccessDenied";

class QuotationsScreen extends Component {
  render() {
    const appMode = selectors.ui.getAppMode(store.getState());
    return (
      (appMode === appConstants.mode.MODE_COMPANY && (
        <AccessDenied navigation={this.props.navigation} mode="công ty" />
      )) || (
        <View style={{ flex: 1 }}>
          <QuotationList navigation={this.props.navigation} />
        </View>
      )
    );
  }
}

QuotationsScreen.navigationOptions = ({ navigation }) => ({
  title: "Danh sách báo giá",
  headerLeft: (
    <Icon
      style={{ paddingLeft: 10 }}
      name="md-menu"
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  ),
  headerRight: (
    <Icon
      style={{ paddingRight: 10 }}
      name="ios-add"
      size={30}
      onPress={() => navigation.navigate("CreateQuotation")}
    />
  )
});

export default QuotationsScreen;

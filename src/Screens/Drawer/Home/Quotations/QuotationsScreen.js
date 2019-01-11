import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import QuotationList from "~/Components/QuotationList";

class QuotationsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <QuotationList />
        </ScrollView>
      </View>
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

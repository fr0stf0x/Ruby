import React, { Component } from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

class QuotationsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>QuotationsScreen</Text>
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
  )
});

export default QuotationsScreen;

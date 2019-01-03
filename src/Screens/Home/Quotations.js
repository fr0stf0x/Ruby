import React, { Component } from "react";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class QuotationsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>QuotationsScreen</Text>
      </View>
    );
  }
}
QuotationsScreen.navigationOptions = {
  tabBarIcon: <Icon name="list-ol" size={20} />
};

export default QuotationsScreen;

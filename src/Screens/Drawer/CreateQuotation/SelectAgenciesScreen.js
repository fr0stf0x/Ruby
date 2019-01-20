import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import AgencyList from "~/Components/AgencyList";

class SelectAgenciesScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "rgb(232, 241, 249)" }}>
        <AgencyList type={appConstants.productItemContext.QUOTATION} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionText: {
    fontSize: 17,
    color: "#2a72ef",
    paddingEnd: 5
  }
});

SelectAgenciesScreen.navigationOptions = {
  title: "Chọn đại lý",
  headerRight: (
    <TouchableOpacity onPress={actions.global.globalToggleCheckAgencies}>
      <Text style={styles.actionText}>Chọn tất cả</Text>
    </TouchableOpacity>
  )
};

export default SelectAgenciesScreen;

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import appConstants from "~/appConstants";
import AgencyList from "~/Components/AgencyList";

class AgenciesScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <AgencyList
          type={appConstants.productItemContext.SHOW}
          navigation={navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "rgb(232, 241, 249)"
  }
});

AgenciesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Danh sách đại lý",
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
        onPress={() => navigation.navigate("CreateAccount")}
      />
    )
  };
};

export default AgenciesScreen;

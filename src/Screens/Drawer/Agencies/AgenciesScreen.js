import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Text } from "react-native-elements";
import selectors from "~/Selectors";
import { connect } from "react-redux";
class AgenciesScreen extends Component {
  render() {
    const { agencies } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Text> AgenciesScreen </Text>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Button
            title="Thêm đại lý"
            onPress={() => this.props.navigation.navigate("CreateAgency")}
          />
        </ScrollView>
      </View>
    );
  }
}

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
    )
  };
};

export default connect(state => ({
  agencies: selectors.data.getAgencies(state)
}))(AgenciesScreen);

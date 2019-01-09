import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import AgencyList from "~/Components/AgencyList";
import selectors from "~/Selectors";

class AgenciesScreen extends Component {
  goToDetail = agencyId => {
    this.props.navigation.navigate("AgencyDetail", { id: agencyId });
  };

  render() {
    const { agencies, navigation } = this.props;
    return (
      <View style={styles.container}>
        <AgencyList {...agencies} navigation={navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state)
  }),
  dispatch => ({
    addAgencyToCart: id => dispatch()
  })
)(AgenciesScreen);

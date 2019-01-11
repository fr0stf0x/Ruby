import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";

class AgenciesBox extends Component {
  areAgenciesChecked = () => {
    const { selectedAgencyIds } = this.props;
    return selectedAgencyIds;
  };

  render() {
    const {
      selectedAgencyIds,
      agencies,
      removeAgency,
      navigation
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.agenciesBox}>
          <ScrollView contentContainerStyle={styles.agenciesScroll}>
            {selectedAgencyIds &&
              selectedAgencyIds.map((agencyId, key) => (
                <View key={key} style={styles.agencyItem}>
                  <Text
                    style={{ fontSize: 15, width: 110 }}
                    numberOfLines={1}
                    ellipsizeMode="head"
                  >
                    {agencies.byId[agencyId].detail.info.name}
                  </Text>
                  <Icon
                    style={{ marginHorizontal: 2 }}
                    color="red"
                    name="ios-remove-circle-outline"
                    size={24}
                    onPress={() => removeAgency(agencyId)}
                  />
                </View>
              ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("SelectAgencies")}
            >
              <Icon name="ios-add" size={20} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  agenciesBox: {
    ...globalColorsAndStyles.style.boxShadow,
    flex: 1,
    flexDirection: "row",
    margin: 10,
    borderStyle: "solid",
    borderWidth: 1,
    maxHeight: 110,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#4286f4"
  },
  agenciesScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5
  },
  agencyItem: {
    ...globalColorsAndStyles.style.boxShadow,
    height: 40,
    // flexBasis: 150,
    margin: 5,
    padding: 5,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "rgb(126,183,164)",
    borderColor: "#4286f4"
  },
  addButton: {
    ...globalColorsAndStyles.style.boxShadow,
    backgroundColor: globalColorsAndStyles.color.primaryLight,
    margin: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    width: 40,
    height: 40
  }
});

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state),
    selectedAgencyIds: selectors.cart.getSelectedAgenciesInCart(state)
  }),
  dispatch => ({
    removeAgency: id => dispatch(actions.cart.toggleCheckAgency(id))
  })
)(AgenciesBox);

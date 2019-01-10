import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { globalColorsAndStyles } from "~/Theme";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import selectors from "~/Selectors";
import actions from "~/Actions";

class AgenciesBox extends Component {
  render() {
    const {
      selectedAgencyIds,
      agencies,
      removeAgency,
      navigation
    } = this.props;
    return (
      <View style={styles.agenciesBox}>
        {selectedAgencyIds &&
          selectedAgencyIds.map((agencyId, key) => (
            <View key={key} style={styles.agencyItem}>
              <Text style={{ fontSize: 15 }}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  agenciesBox: {
    ...globalColorsAndStyles.style.boxShadow,
    flexDirection: "row",
    margin: 5,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#4286f4"
  },
  agencyItem: {
    ...globalColorsAndStyles.style.boxShadow,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "rgba(126,183,164,0.9)",
    borderColor: "#4286f4"
  },
  addButton: {
    ...globalColorsAndStyles.style.boxShadow,
    backgroundColor: globalColorsAndStyles.color.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    width: 48,
    height: 48
  }
});

export default connect(
  state => ({
    agencies: selectors.data.getAgencies(state),
    selectedAgencyIds: selectors.cart.getSelectedAgenciesInCreatingQuotation(
      state
    )
  }),
  dispatch => ({
    removeAgency: id => dispatch(actions.cart.toggleCheckAgency(id))
  })
)(AgenciesBox);

import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { globalColorsAndStyles } from "~/Theme";
import Icon from "react-native-vector-icons/Ionicons";

export default class AcceptAndRejectButtons extends Component {
  render() {
    const { onAccept, onReject } = this.props;
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onAccept}>
          <Icon size={24} name="ios-checkmark" />
          <Text style={styles.text}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.buttonContainer,
            marginLeft: 10,
            backgroundColor: "rgba(252, 189, 189, 0.6)"
          }}
          onPress={onReject}
        >
          <Icon size={24} name="ios-remove-circle-outline" />
          <Text style={styles.text}>Từ chối</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    ...globalColorsAndStyles.style.boxShadow,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(189, 233, 252, 0.6)"
  },
  text: {
    fontSize: 16,
    paddingLeft: 5
  }
});

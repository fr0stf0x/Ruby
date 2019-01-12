import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import { globalColorsAndStyles } from "~/Theme";

export default class NewItemBadge extends Component {
  render() {
    const { text } = this.props;
    return (
      (text && (
        <View style={styles.container}>
          <View style={styles.badgeContainer}>
            <Text style={styles.newText}>Mới</Text>
            <Icon name="new" size={24} />
          </View>
        </View>
      )) || <Icon name="new" style={{ marginHorizontal: 5 }} size={24} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    ...globalColorsAndStyles.style.boxShadow,
    backgroundColor: "rgba(189, 252, 229, 0.4)",
    alignItems: "center",
    justifyContent: "center"
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  newText: {
    fontSize: 18,
    color: globalColorsAndStyles.color.primaryText
  }
});

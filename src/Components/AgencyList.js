import React from "react";
import { TouchableOpacity, StyleSheet, ScrollView, View } from "react-native";
import { globalColorsAndStyles } from "~/Theme";
import { randomAgencyImage, makeCall } from "~/Utils/utils";
import { Card, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { goToDetail } from "~/Actions/nav.actions";
import { connect } from "react-redux";
import actions from "~/Actions";

const AgencyCard = connect(
  state => ({}),
  (dispatch, { navigation }) => ({
    createQuotation: id => {
      dispatch(actions.cart.addAgencyToCart(id));
      navigation.navigate("CreateQuotation");
    }
  })
)(({ id, info, createQuotation }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => goToDetail(id)}>
      <Card
        containerStyle={globalColorsAndStyles.style.boxShadow}
        title={info.name}
        image={randomAgencyImage()}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            title="Báo giá"
            icon={<Icon color="#fff" name="ios-calculator" size={20} />}
            buttonStyle={styles.actionButton}
            titleStyle={styles.actionButtonTitle}
            onPress={() => createQuotation(id)}
          />
          <Button
            title={info.phone}
            icon={<Icon color="#fff" name="ios-call" size={20} />}
            titleStyle={styles.actionButtonTitle}
            buttonStyle={{
              ...styles.actionButton,
              backgroundColor: globalColorsAndStyles.color.secondary
            }}
            onPress={() => makeCall(info.phone)}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
});

const AgencyList = ({ allIds, byId, navigation }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      {allIds.map(id => {
        const { info } = byId[id].detail;
        return (
          <View key={id}>
            <AgencyCard id={id} info={info} navigation={navigation} />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: 140
  },
  actionButtonTitle: {
    fontSize: 14
  }
});

export default AgencyList;

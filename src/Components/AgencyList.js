import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Card, CheckBox, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { makeCall, randomAgencyImage } from "~/Utils/utils";

const AgencyCard = ({ id, info, goToDetail, action }) => {
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
            buttonStyle={styles().actionButton}
            titleStyle={styles().actionButtonTitle}
            onPress={() => action(id)}
          />
          <Button
            title={info.phone}
            icon={<Icon color="#fff" name="ios-call" size={20} />}
            titleStyle={styles().actionButtonTitle}
            buttonStyle={{
              ...styles().actionButton,
              backgroundColor: globalColorsAndStyles.color.secondary
            }}
            onPress={() => makeCall(info.phone)}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const AgencyItem = ({ info, index, checked, action }) => {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles(index).listItem}>
        <View style={styles().imageContainer}>
          <Image
            source={randomAgencyImage()}
            resizeMode="cover"
            style={{ width: 100, height: 100 }}
          />
        </View>
        <View style={[styles().info, { flex: 1, alignContent: "center" }]}>
          <Text style={styles().listItemTitle}>{info.name}</Text>
        </View>
      </View>
      <View style={{ alignSelf: "center" }}>
        <CheckBox
          checkedIcon="dot-circle-o"
          uncheckedColor={globalColorsAndStyles.color.primaryText}
          uncheckedIcon="circle-o"
          checked={checked}
          onPress={action}
        />
      </View>
    </View>
  );
};

const AgencyList = ({
  type,
  agencies: { allIds, byId },
  selectedAgencyIds,
  toggleAddAgencyToCart,
  toggleAddAgencyToCartAndRedirect
}) => {
  const unSelectedAgencyIds = allIds.filter(
    id => !selectedAgencyIds.includes(id)
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      {type === appConstants.productItemContext.SHOW ? (
        allIds.map((id, key) => (
          <View key={key}>
            <AgencyCard
              id={id}
              info={byId[id].detail.info}
              action={toggleAddAgencyToCartAndRedirect}
            />
          </View>
        ))
      ) : (
        <View>
          {selectedAgencyIds.map((id, key) => (
            <View key={key}>
              <AgencyItem
                index={key}
                checked={true}
                info={byId[id].detail.info}
                action={() => toggleAddAgencyToCart(id)}
              />
            </View>
          ))}
          {unSelectedAgencyIds.map((id, key) => (
            <View key={key}>
              <AgencyItem
                index={selectedAgencyIds.length + key}
                checked={false}
                info={byId[id].detail.info}
                action={() => toggleAddAgencyToCart(id)}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = key =>
  StyleSheet.create({
    listItem: {
      ...globalColorsAndStyles.style.boxShadow,
      flex: 1,
      flexDirection: "row",
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor:
        key % 2
          ? globalColorsAndStyles.color.primaryLight
          : globalColorsAndStyles.color.secondaryLight
    },
    listItemTitle: {
      fontSize: 20,
      color: globalColorsAndStyles.color.primaryText
    },
    infoAndActions: {
      flex: 1,
      flexDirection: "row"
    },
    info: {
      paddingLeft: 20,
      alignSelf: "center"
    },
    actions: {
      flex: 1,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: 20
    },
    actionButton: {
      width: 140
    },
    actionButtonTitle: {
      fontSize: 14
    }
  });

const mapStateToProps = state => ({
  agencies: selectors.data.getAgencies(state),
  selectedAgencyIds: selectors.cart.getSelectedAgenciesInCreatingQuotation(
    state
  )
});

const mapDispatchToProps = (dispatch, props) => ({
  goToDetail: id => props.navigation.navigate("AgencyDetail", { id }),
  toggleAddAgencyToCart: id => dispatch(actions.cart.toggleCheckAgency(id)),
  toggleAddAgencyToCartAndRedirect: id => {
    dispatch(actions.cart.addAgencyToCartIfNeeded(id));
    props.navigation.navigate("CreateQuotation");
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgencyList);

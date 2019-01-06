import React, { Component } from "react";
import {
  Linking,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { randomImageAgency } from "~/Utils/utils";
class AgenciesScreen extends Component {
  makeCall = phone => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url).catch(() => null);
      }
    });
  };

  goToDetail = agencyId => {
    this.props.navigation.navigate("AgencyDetail", { id: agencyId });
  };

  createQuotation = agencyId => {
    this.props.navigation.navigate("CreateQuotation", { id: agencyId });
  };

  render() {
    const { agencies } = this.props;
    const { allIds, byId } = agencies;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          {allIds.map((id, key) => {
            const { info } = byId[id].detail;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={key}
                onPress={() => this.goToDetail(id)}
              >
                <Card
                  containerStyle={globalColorsAndStyles.style.boxShadow}
                  title={info.name}
                  image={randomImageAgency()}
                >
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <Button
                      title="Báo giá"
                      icon={
                        <Icon color="#fff" name="ios-calculator" size={20} />
                      }
                      buttonStyle={styles.actionButton}
                      titleStyle={styles.actionButtonTitle}
                      onPress={() => this.createQuotation(id)}
                    />
                    <Button
                      title={info.phone}
                      icon={<Icon color="#fff" name="ios-call" size={20} />}
                      titleStyle={styles.actionButtonTitle}
                      buttonStyle={{
                        ...styles.actionButton,
                        backgroundColor: globalColorsAndStyles.color.secondary
                      }}
                      onPress={() => this.makeCall(info.phone)}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(232, 241, 249)"
  },
  actionButton: {
    width: 140
  },
  actionButtonTitle: {
    fontSize: 14
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

export default connect(state => ({
  agencies: selectors.data.getAgencies(state)
}))(AgenciesScreen);

import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Picker,
  Platform,
  Alert
} from "react-native";
import {
  Button,
  Input,
  Text,
  ButtonGroup,
  Divider
} from "react-native-elements";

import { connect } from "react-redux";
import actions from "~/Actions";
import appConstants from "~/appConstants";
import { globalColorsAndStyles } from "~/Theme";
import { validateFields } from "~/Utils/utils";

const constrants = {
  agencyName: {
    length: {
      minimum: 8,
      message: "^Phải điền tên đại lý chính xác"
    }
  },

  agencyAddress: {
    length: {
      minimum: 8,
      message: "^Phải điền địa chỉ chính xác"
    }
  },
  agencyPhone: {
    length: {
      minimum: 8,
      maximum: 12,
      message: "^Số điện thoại không đúng định dạng"
    }
  }
};

class GroupInfoForm extends Component {
  state = {
    agencyName: "",
    agencyAddress: "",
    agencyPhone: "",
    defaultOffPercent: "0",
    agencyType: appConstants.groupType.AGENCY,
    error: false
  };

  AgencyPicker = () => {
    const options = [
      { label: "Đại lý cấp dưới", value: appConstants.groupType.AGENCY },
      { label: "Nhà bán lẻ", value: appConstants.groupType.RETAIL }
    ];
    return Platform.select({
      ios: (
        <View style={{ ...globalColorsAndStyles.style.boxShadow }}>
          <ButtonGroup
            onPress={selectedIndex => {
              this.setState({
                agencyType: options[selectedIndex].value
              });
            }}
            buttons={options.map((option, key) => (
              <Text key={key}>{option.label}</Text>
            ))}
            selectedButtonStyle={{
              backgroundColor: globalColorsAndStyles.color.secondary
            }}
            selectedIndex={options.findIndex(
              option => option.value === this.state.agencyType
            )}
            containerStyle={{
              width: 300
            }}
          />
        </View>
      ),
      android: (
        <Picker
          selectedValue={options[0]}
          style={{ width: 200, height: 100 }}
          onValueChange={itemValue => this.setState({ agencyType: itemValue })}
        >
          {options.map((option, key) => (
            <Picker.Item key={key} label={option.label} value={option.value} />
          ))}
        </Picker>
      )
    });
  };

  validateForm = () => {
    const { agencyName, agencyAddress, agencyPhone } = this.state;
    const fields = {
      agencyName,
      agencyAddress,
      agencyPhone
    };
    this.setState(
      { error: validateFields(fields, constrants) },
      this.submitForm
    );
  };

  submitForm = () => {
    const { email, password, name } = this.props.navigation.getParam(
      "accountInfo"
    );
    const {
      agencyType,
      agencyName,
      agencyAddress,
      agencyPhone,
      defaultOffPercent
    } = this.state;

    const data = {
      account: {
        email,
        password
      },
      accountProfile: {
        name,
        email
      },
      groupInfo: {
        name: agencyName,
        address: agencyAddress,
        phone: agencyPhone,
        type: agencyType
      },
      defaultOffPercent
    };
    if (!this.state.error) {
      const { toggleLoading, createAgency, navigation, logOut } = this.props;
      toggleLoading();
      createAgency(data)
        .then(res => {
          Alert.alert("Tạo đại lý thành công", "Bạn cần phải đăng nhập lại", [
            {
              text: "Ok",
              onPress: () => logOut().then(() => navigation.navigate("Login"))
            }
          ]);
        })
        .finally(toggleLoading);
    }
  };

  render() {
    const {
      error,
      agencyName,
      agencyAddress,
      agencyPhone,
      defaultOffPercent
    } = this.state;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={Styles.FlexBasis} h4>
            Tài khoản
          </Text>
          <View style={Styles.FlexBasis}>
            <this.AgencyPicker options={Object.keys(appConstants.groupType)} />
          </View>
          <View style={Styles.FlexBasis}>
            <Input
              textContentType="organizationName"
              value={agencyName}
              placeholder="Tên đại lý"
              onChangeText={agencyName => this.setState({ agencyName })}
            />
            {error &&
              error.agencyName &&
              error.agencyName.map((err, key) => (
                <View key={key}>
                  <Text style={Styles.Error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>
          <View style={Styles.FlexBasis}>
            <Input
              dataDetectorTypes="address"
              textContentType={"fullStreetAddress" || "location"}
              value={agencyAddress}
              placeholder="Địa chỉ"
              onChangeText={agencyAddress => this.setState({ agencyAddress })}
            />
            {error &&
              error.agencyAddress &&
              error.agencyAddress.map((err, key) => (
                <View key={key}>
                  <Text style={Styles.Error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>
          <View style={Styles.FlexBasis}>
            <Input
              dataDetectorTypes="phoneNumber"
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              value={agencyPhone}
              placeholder="Số điện thoại"
              onChangeText={agencyPhone => this.setState({ agencyPhone })}
            />
            {error &&
              error.agencyPhone &&
              error.agencyPhone.map((err, key) => (
                <View key={key}>
                  <Text style={Styles.Error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>

          <View style={Styles.FlexBasis}>
            <Input
              keyboardType="numeric"
              value={defaultOffPercent}
              placeholder="Tỉ lệ chiết khấu mặc định"
              onChangeText={defaultOffPercent =>
                this.setState({ defaultOffPercent })
              }
            />
          </View>
          <Button title="Đồng ý" onPress={this.validateForm} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const Styles = StyleSheet.create({
  FlexBasis: {
    flexBasis: 70
  },
  Error: {
    color: globalColorsAndStyles.color.error,
    textAlign: "center"
  }
});

export default connect(
  state => ({}),
  dispatch => ({
    createAgency: data => dispatch(actions.data.makeCreateAgencyAccount(data)),
    toggleLoading: () => dispatch(actions.ui.toggleLoading()),
    logOut: () => dispatch(actions.auth.makeLogOut())
  })
)(GroupInfoForm);

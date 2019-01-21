import React, { Component } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import actions from "~/Actions";
import { globalColorsAndStyles } from "~/Theme";
import { validateFieldsWithCheckEmailExistenceAsync } from "~/Utils/utils";
import appConstants from "~/appConstants";
import AccessDenied from "~/Screens/AccessDenied";
import selectors from "~/Selectors";

const constrants = {
  email: {
    email: {
      message: "^Email không đúng định dạng"
    },
    emailExists: {
      message: "^Email đã tồn tại"
    }
  },
  password: {
    length: {
      minimum: 6,
      message: "^Phải nhập mật khẩu ít nhất 6 kí tự"
    }
  },
  name: {
    length: {
      minimum: 6,
      message: "^Phải nhập tên ít nhất 6 kí tự"
    }
  }
};

class CreateAccount extends Component {
  static navigationOptions = {
    title: "Tạo tài khoản"
  };

  state = {
    email: "",
    password: "",
    name: "",
    passwordShown: false,
    error: {}
  };

  toggleRevealPassword = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  validateForm = () => {
    const { toggleLoading } = this.props;
    const { email, password, name } = this.state;
    const fields = { email, password, name };
    toggleLoading();
    validateFieldsWithCheckEmailExistenceAsync(fields, constrants)
      .then(() => {
        this.setState({ error: false }, () =>
          this.props.navigation.navigate("GroupInfoForm", {
            accountInfo: fields
          })
        );
      })
      .catch(error => this.setState({ error }))
      .finally(toggleLoading);
  };

  render() {
    const { appMode } = this.props;
    const { email, password, name, passwordShown, error } = this.state;
    return (
      (appMode === appConstants.mode.MODE_RETAIL && (
        <AccessDenied
          navigation={this.props.navigation}
          mode="bán lẻ"
          functional="Chức năng tạo đại lý"
        />
      )) || (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: "none" })}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={"on-drag"}
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={Styles.FlexBasis} h4>
              Tài khoản
            </Text>
            <View style={Styles.FlexBasis}>
              <Input
                textContentType="emailAddress"
                keyboardType="email-address"
                value={email}
                placeholder="Email"
                onChangeText={email => this.setState({ email })}
              />
              {error &&
                error.email &&
                error.email.map((err, key) => (
                  <View key={key}>
                    <Text style={Styles.Error}>{err}</Text>
                  </View>
                ))}
            </View>
            <View style={Styles.FlexBasis}>
              <Input
                secureTextEntry={!passwordShown}
                value={password}
                placeholder="Mật khẩu"
                onChangeText={password => this.setState({ password })}
                rightIcon={
                  password.length > 0 && (
                    <Icon
                      name={(passwordShown && "eye-off") || "eye"}
                      onPress={this.toggleRevealPassword}
                      size={24}
                    />
                  )
                }
              />
              {error &&
                error.password &&
                error.password.map((err, key) => (
                  <View key={key}>
                    <Text style={Styles.Error}>{err}</Text>
                  </View>
                ))}
            </View>
            <View style={Styles.FlexBasis}>
              <Input
                textContentType="name"
                value={name}
                placeholder="Tên người dùng"
                onChangeText={name => this.setState({ name })}
              />
              {error &&
                error.name &&
                error.name.map((err, key) => (
                  <View key={key}>
                    <Text style={Styles.Error}>{err}</Text>
                  </View>
                ))}
            </View>
            <Button title="Tiếp tục" onPress={this.validateForm} />
            <Button
              buttonStyle={{
                backgroundColor: globalColorsAndStyles.color.secondary
              }}
              title="Huỷ bỏ"
              onPress={() => this.props.navigation.navigate("AgenciesScreen")}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      )
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
  state => ({
    appMode: selectors.ui.getAppMode(state)
  }),
  dispatch => ({ toggleLoading: () => dispatch(actions.ui.toggleLoading()) })
)(CreateAccount);

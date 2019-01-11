import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { connect } from "react-redux";
import actions from "~/Actions";
import { globalColorsAndStyles } from "~/Theme";
import { validateFields } from "~/Utils/utils";
import NumericInput from "react-native-numeric-input";

const constrants = {
  name: {
    length: {
      minimum: 8,
      message: "^Phải điền tên sản phẩm chính xác"
    }
  },
  // defaultPrice: {
  //   length: {
  //     minimum: 4,
  //     message: "^Phải điền giá khởi điểm chính xác"
  //   }
  // },
  type: {
    length: {
      minimum: 1,
      message: "^Phải điền loại sản phẩm"
    }
  }
};

class AddProduct extends Component {
  static navigationOptions = {
    title: "Thêm sản phẩm"
  };

  state = {
    error: false,
    name: "",
    // defaultPrice: "",
    defaultPrice: 1000,
    type: ""
  };

  validateForm = () => {
    const {
      name,
      // defaultPrice,
      type
    } = this.state;
    const fields = {
      name,
      // defaultPrice,
      type
    };
    this.setState(
      { error: validateFields(fields, constrants) },
      this.submitForm
    );
  };

  submitForm = () => {
    if (!this.state.error) {
      const { addProduct, toggleLoading, navigation } = this.props;
      toggleLoading();
      addProduct(this.state)
        .then(
          Alert.alert("Thành công", "", [
            {
              text: "Quay lại danh sách",
              onPress: this.goBackToList
            }
          ])
        )
        .finally(toggleLoading);
    }
  };

  goBackToList = () => {
    this.props.navigation.navigate("Products");
  };

  render() {
    const { error, name, defaultPrice, type } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={Styles.FlexBasis}>
            <Input
              textContentType="name"
              value={name}
              placeholder="Tên sản phẩm"
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

          <View style={Styles.FlexBasis}>
            <Input
              textContentType="name"
              value={type}
              placeholder="Loại sản phẩm"
              onChangeText={type => this.setState({ type })}
            />
            {error &&
              error.type &&
              error.type.map((err, key) => (
                <View key={key}>
                  <Text style={Styles.Error}>{err}</Text>
                </View>
              ))}
          </View>
          <View style={Styles.FlexBasis}>
            {/* <Input
              value={defaultPrice}
              placeholder="Giá khởi điểm"
              onChangeText={defaultPrice => this.setState({ defaultPrice })}
            />
            {error &&
              error.defaultPrice &&
              error.defaultPrice.map((err, key) => (
                <View key={key}>
                  <Text style={Styles.Error}>{err}</Text>
                </View>
              ))} */}
            <View
              style={{
                ...globalColorsAndStyles.style.boxShadow,
                padding: 5,
                flexDirection: "row",
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 20,
                backgroundColor: "rgb(255,255,255)",
                borderColor: "#4286f4",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 17, paddingEnd: 10 }}>
                Giá khởi điểm
              </Text>
              <NumericInput
                initValue={defaultPrice}
                value={defaultPrice}
                onChange={defaultPrice => this.setState({ defaultPrice })}
                type="up-down"
                minValue={0}
                totalHeight={40}
                iconSize={20}
                step={500}
                rounded
                textColor="#B0228C"
                iconStyle={{ color: "white" }}
                upDownButtonsBackgroundColor="#EA3788"
                // leftButtonBackgroundColor="#E56B70"
              />
            </View>
          </View>
          <Button title="Đồng ý" onPress={this.validateForm} />
          <Button
            buttonStyle={{
              backgroundColor: globalColorsAndStyles.color.secondary
            }}
            title="Huỷ bỏ"
            onPress={this.goBackToList}
          />
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
    addProduct: data => dispatch(actions.data.addProduct(data)),
    toggleLoading: () => dispatch(actions.ui.toggleLoading())
  })
)(AddProduct);

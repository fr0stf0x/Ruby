import React, { Component } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import firebase from "react-native-firebase";
import NumericInput from "react-native-numeric-input";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import { globalColorsAndStyles } from "~/Theme";
import { validateFields, formatDateTimeForFileName } from "~/Utils/utils";

const constrants = {
  name: {
    length: {
      minimum: 8,
      message: "^Phải điền tên sản phẩm chính xác"
    }
  },
  type: {
    length: {
      minimum: 1,
      message: "^Phải điền loại sản phẩm"
    }
  },
  image: {
    presence: {
      message: "^Chưa chọn hình ảnh"
    }
  }
};

let { height, width } = Dimensions.get("window");

class AddProduct extends Component {
  static navigationOptions = {
    title: "Thêm sản phẩm"
  };

  state = {
    error: false,
    name: "",
    defaultPrice: 1000,
    type: "",
    image: null
  };

  selectPhotos = () => {
    const { navigation } = this.props;
    navigation.navigate("ImageBrowser", {
      selectPicture: image => {
        this.setState({ image });
      }
    });
  };

  validateForm = () => {
    const { name, type, image } = this.state;
    const fields = {
      name,
      type,
      image
    };
    this.setState(
      { error: validateFields(fields, constrants) },
      this.submitForm
    );
  };

  submitForm = () => {
    const { name, defaultPrice, type, image, error } = this.state;
    if (!error) {
      const { addProduct } = this.props;
      promiseWithLoadingAnimation(() => {
        const storageRef = firebase.storage().ref();
        const productData = { name, defaultPrice, type };
        return storageRef
          .child(
            `images/products/${
              image.filename
                ? image.filename
                : formatDateTimeForFileName(new Date()) + ".jpg"
            }`
          )
          .putFile("file://" + image.uri)
          .then(file => {
            productData.imageUrl = file.downloadURL;
            return addProduct(productData).then(
              Alert.alert("Thành công", "", [
                {
                  text: "Quay lại danh sách",
                  onPress: this.goBackToList
                }
              ])
            );
          });
      });
    }
  };

  goBackToList = () => {
    this.props.navigation.navigate("Products");
  };

  render() {
    const { error, name, defaultPrice, type, image } = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: "" })}
        style={{ flex: 1, padding: 10 }}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={styles.imageInputContainer}>
            {(image && (
              <View>
                <Icon
                  style={styles.removeImageIcon}
                  name="remove"
                  size={24}
                  onPress={() => this.setState({ image: null })}
                />
                <TouchableOpacity onPress={this.selectPhotos}>
                  <Image
                    source={{ uri: image.uri }}
                    style={{
                      width: width / 1.5,
                      height: width / 1.5,
                      marginBottom: 10
                    }}
                  />
                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  {image.filename}
                </Text>
              </View>
            )) || (
              <Button
                title="Chọn ảnh"
                buttonStyle={{
                  backgroundColor:
                    (error &&
                      error.image &&
                      globalColorsAndStyles.color.error) ||
                    globalColorsAndStyles.color.secondary
                }}
                onPress={this.selectPhotos}
              />
            )}
          </View>
          <View style={styles.flexBasis}>
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
                  <Text style={styles.error}>{err}</Text>
                </View>
              ))}
          </View>
          <View style={styles.flexBasis}>
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
                  <Text style={styles.error}>{err}</Text>
                </View>
              ))}
          </View>
          <View style={styles.flexBasis}>
            <View style={styles.priceInputContainer}>
              <Text style={{ fontSize: 17, color: "#5b7296", paddingEnd: 10 }}>
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
              />
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Đồng ý" onPress={this.validateForm} />
            <Button
              buttonStyle={{
                backgroundColor: globalColorsAndStyles.color.secondary
              }}
              title="Huỷ bỏ"
              onPress={this.goBackToList}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  priceInputContainer: {
    ...globalColorsAndStyles.style.boxShadow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgb(255,255,255)",
    borderColor: "#4286f4",
    alignItems: "center"
  },
  imageInputContainer: {
    padding: 10,
    alignItems: "center",
    width: 200
  },
  buttonGroup: {
    flexDirection: "row"
  },
  flexBasis: {
    flexBasis: 70
  },
  error: {
    color: globalColorsAndStyles.color.error,
    textAlign: "center"
  },
  removeImageIcon: {
    zIndex: 10,
    position: "absolute",
    top: -10,
    right: -10
  }
});

export default connect(
  state => ({}),
  dispatch => ({
    addProduct: data => dispatch(actions.data.addProduct(data)),
    toggleLoading: () => dispatch(actions.ui.toggleLoading())
  })
)(AddProduct);

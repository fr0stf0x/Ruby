import React, { Component } from "react";
import {
  Alert,
  AsyncStorage,
  Image,
  KeyboardAvoidingView,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  Button,
  ButtonGroup,
  Divider,
  Input,
  Text
} from "react-native-elements";
import firebase from "react-native-firebase";
import NumericInput from "react-native-numeric-input";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";
import appConstants from "~/appConstants";
import { globalColorsAndStyles } from "~/Theme";
import { formatDateTimeForFileName, validateFields } from "~/Utils/utils";

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
  },
  image: {
    presence: {
      message: "^Chưa chọn hình ảnh"
    }
  }
};

class GroupInfoForm extends Component {
  state = {
    agencyName: "",
    agencyAddress: "",
    agencyPhone: "",
    // defaultOffPercent: "0",
    defaultOffPercent: 0,
    agencyType: appConstants.groupType.AGENCY,
    image: null,
    error: false
  };

  selectPhotos = () => {
    const { navigation } = this.props;
    navigation.navigate("ImageBrowser", {
      selectPicture: image => {
        this.setState({ image });
      }
    });
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
    const { agencyName, agencyAddress, agencyPhone, image } = this.state;
    const fields = {
      agencyName,
      agencyAddress,
      agencyPhone,
      image
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
      defaultOffPercent,
      image
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
      const {
        createAgency,
        navigation,
        logOut,
        logIn,
        redirectToAddProductsForAgency
      } = this.props;
      promiseWithLoadingAnimation(() => {
        const storageRef = firebase.storage().ref();
        return storageRef
          .child(
            `images/agencies/${
              image.filename
                ? image.filename
                : formatDateTimeForFileName(new Date()) + ".jpg"
            }`
          )
          .putFile("file://" + image.uri)
          .then(file => {
            data.groupInfo.imageUrl = file.downloadURL;
            return createAgency(data).then(async groupId => {
              const email = await AsyncStorage.getItem("email");
              const password = await AsyncStorage.getItem("password");
              logOut().then(async () =>
                logIn({ email, password }).then(async () => {
                  Alert.alert(
                    "Tạo đại lý thành công",
                    "Bạn có muốn thêm sản phẩm cho đại lý này không?",
                    [
                      {
                        text: "Có",
                        onPress: () => redirectToAddProductsForAgency(groupId)
                      },
                      {
                        text: "Không",
                        onPress: () => navigation.navigate("AgenciesScreen")
                      }
                    ]
                  );
                })
              );
            });
          });
      });
    }
  };

  render() {
    const {
      error,
      agencyName,
      agencyAddress,
      agencyPhone,
      image,
      defaultOffPercent
    } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "none" })}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.flexBasis}>
            <this.AgencyPicker options={Object.keys(appConstants.groupType)} />
          </View>
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
                      width: 200,
                      height: 200,
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
              textContentType="organizationName"
              value={agencyName}
              placeholder="Tên đại lý"
              onChangeText={agencyName => this.setState({ agencyName })}
            />
            {error &&
              error.agencyName &&
              error.agencyName.map((err, key) => (
                <View key={key}>
                  <Text style={styles.error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>
          <View style={styles.flexBasis}>
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
                  <Text style={styles.error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>
          <View style={styles.flexBasis}>
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
                  <Text style={styles.error}>{err}</Text>
                  <Divider />
                </View>
              ))}
          </View>

          <View style={styles.flexBasis}>
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
                Tỉ lệ chiêt khấu mặc định
              </Text>
              <NumericInput
                initValue={defaultOffPercent}
                value={defaultOffPercent}
                onChange={defaultOffPercent =>
                  this.setState({ defaultOffPercent })
                }
                type="up-down"
                minValue={0}
                maxValue={100}
                totalWidth={100}
                totalHeight={40}
                iconSize={20}
                step={0.5}
                valueType="real"
                rounded
                textColor="#B0228C"
                iconStyle={{ color: "white" }}
                upDownButtonsBackgroundColor="#EA3788"
              />
            </View>
          </View>
          <Button title="Đồng ý" onPress={this.validateForm} />
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
    flexBasis: 60
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
  (dispatch, props) => ({
    logOut: () => dispatch(actions.auth.makeLogOut()),
    logIn: ({ email, password }) =>
      dispatch(actions.auth.makeLogIn({ email, password })),
    createAgency: data => dispatch(actions.data.makeCreateAgencyAccount(data)),
    redirectToAddProductsForAgency: id => {
      dispatch(
        actions.cart.addAgencyToCartIfNeeded(
          id,
          appConstants.productItemContext.ADD_TO_AGENCY
        )
      );
      props.navigation.navigate("AddProductsForAgency", { id });
    }
  })
)(GroupInfoForm);

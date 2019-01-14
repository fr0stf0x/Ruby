import React, { Component } from "react";
import {
  Platform,
  CameraRoll,
  PermissionsAndroid,
  ScrollView,
  Modal,
  SafeAreaView,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/Ionicons";
import { formatDateTimeForFileName } from "~/Utils/utils";
import { Button } from "react-native-elements";
import { globalColorsAndStyles } from "~/Theme";

let { height, width } = Dimensions.get("window");
let orientation = height > width ? "Portrait" : "Landscape";

export default class ImageBrowser extends Component {
  state = {
    orientation,
    image: null,
    selectPhotos: false,
    cameraOpen: false,
    photos: []
  };

  componentWillMount() {
    Dimensions.addEventListener("change", this.handleOrientationChange);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.handleOrientationChange);
  }

  handleOrientationChange = dimensions => {
    ({ height, width } = dimensions.window);
    orientation = height > width ? "Portrait" : "Landscape";
    this.setState({ orientation });
  };

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 50,
      assetType: "All"
    }).then(r => this.setState({ photos: r.edges }));
  };

  requestPhotosPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.selectPhotos();
      } else {
        console.log("Photos permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.requestStoragePermission();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.takePhoto();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  setImage = image => {
    if (
      !this.state.image ||
      (this.state.image && image.uri !== this.state.image.uri)
    ) {
      this.setState({ image }, this.toggleSelectPhotos);
    }
  };

  selectPhotos = () => {
    this.toggleSelectPhotos();
    this.getPhotos();
  };

  takePhoto = () => {
    this.toggleCamera();
  };

  toggleSelectPhotos = () => {
    this.setState({ selectPhotos: !this.state.selectPhotos });
  };

  toggleCamera = () => {
    this.setState({ cameraOpen: !this.state.cameraOpen });
  };

  goBack = () => {
    const { navigation } = this.props;
    this.state.image && navigation.state.params.selectPicture(this.state.image);
    navigation.goBack();
  };

  render() {
    const { image } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {image && (
          <Image
            resizeMode="cover"
            source={{ uri: image.uri }}
            style={{
              width: width / 1.5,
              height: width / 1.5,
              marginBottom: 20
            }}
          />
        )}
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.cameraOpen}
          onRequestClose={this.toggleCamera}
        >
          <View style={styles.cameraContainer}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              captureAudio={false}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
            />
            <View
              style={
                this.state.orientation === "Portrait"
                  ? styles.buttonContainerPortrait
                  : styles.buttonContainerLandscape
              }
            >
              <TouchableOpacity
                onPress={this.takePicture}
                style={
                  this.state.orientation === "Portrait"
                    ? styles.buttonPortrait
                    : styles.buttonLandscape
                }
              >
                <Icon
                  name="ios-aperture"
                  style={{ fontSize: 40, color: "white" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.toggleCamera}
                style={
                  this.state.orientation === "Portrait"
                    ? styles.buttonPortrait
                    : styles.buttonLandscape
                }
              >
                <Icon
                  name={"ios-checkmark-circle-outline"}
                  style={{ fontSize: 40, color: "white" }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {image && (
            <Button
              buttonStyle={{
                backgroundColor: globalColorsAndStyles.color.secondary
              }}
              title="Ok"
              onPress={this.goBack}
            />
          )}
          <Button
            title="Chụp ảnh"
            onPress={Platform.select({
              android: this.requestCameraPermission,
              ios: this.takePhoto
            })}
          />
          <Button
            title="Chọn ảnh từ thư viện"
            onPress={Platform.select({
              android: this.requestPhotosPermission,
              ios: this.selectPhotos
            })}
          />
        </View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.selectPhotos}
          onRequestClose={this.toggleSelectPhotos}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                {this.state.photos.map((photo, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => this.setImage(photo.node.image)}
                    >
                      <Image
                        style={{
                          width: width / 3,
                          height: width / 3
                        }}
                        source={{ uri: photo.node.image.uri }}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Button title="Close" onPress={this.toggleSelectPhotos} />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      data.filename = formatDateTimeForFileName(new Date()) + ".jpg";
      this.setState(
        {
          image: data
        },
        this.toggleCamera
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  buttonContainerPortrait: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  buttonContainerLandscape: {
    position: "absolute",
    bottom: 0,
    top: 0,
    right: 0,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  buttonPortrait: {
    backgroundColor: "transparent",
    padding: 5,
    marginHorizontal: 20
  },
  buttonLandscape: {
    backgroundColor: "transparent",
    padding: 5,
    marginVertical: 20
  },
  scrollView: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  modalContainer: {
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  }
});

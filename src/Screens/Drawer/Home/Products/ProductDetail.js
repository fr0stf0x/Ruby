import React, { Component } from "react";
import {
  Switch,
  TouchableOpacity,
  StyleSheet,
  Image,
  View
} from "react-native";
import { Text, ThemeProvider, Button } from "react-native-elements";
import { connect } from "react-redux";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import { formatDate } from "~/Utils/utils";
import NumericInput from "react-native-numeric-input";
import actions from "~/Actions";
import { promiseWithLoadingAnimation } from "~/Actions/global";

class ProductDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chi tiết",
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam("editAction")}>
        <Text style={globalColorsAndStyles.style.headerRightText}>Sửa</Text>
      </TouchableOpacity>
    )
  });

  state = {
    edit: false,
    available: this.props.product.status.available,
    price:
      this.props.product.status.price.current ||
      this.props.product.status.price.default
  };

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit });
  };

  inputChange = price => {
    this.setState({ price });
  };

  saveAndExitEdit = () => {
    console.log("saving");
    this.toggleEdit();
    promiseWithLoadingAnimation(() =>
      this.props.doEditProduct({
        id: this.props.navigation.getParam("id"),
        change: this.state
      })
    );
  };

  componentDidMount = () => {
    const { navigation } = this.props;
    navigation.setParams({
      editAction: this.toggleEdit
    });
  };

  render() {
    const { product } = this.props;
    const currentPrice = (
      product.status.price.current || product.status.price.default
    ).toString();
    return (
      <ThemeProvider theme={theme}>
        <View
          style={{
            flex: 1,
            padding: 20,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri: product.detail.localImage || product.detail.imageUrl
            }}
          />
          {!product.status.available && (
            <Text
              style={{
                color: globalColorsAndStyles.color.error,
                textTransform: "uppercase"
              }}
            >
              Không kinh doanh
            </Text>
          )}
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Text>Tên sản phẩm:</Text>
              <Text>Loại sản phẩm:</Text>
              {product.detail.createdAt && <Text>Ngày ra mắt:</Text>}
              <Text>Giá hiện tại</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>{product.detail.name}</Text>
              <Text>{product.detail.type}</Text>
              {product.detail.createdAt && (
                <Text>{formatDate(product.detail.createdAt)}</Text>
              )}
              <Text>{currentPrice}</Text>
            </View>
          </View>
          {this.state.edit && product.status.available === true && (
            <View style={{ width: "100%" }}>
              <View style={styles.container}>
                <Text style={{ paddingEnd: 20 }}>Giá</Text>
                <NumericInput
                  type="up-down"
                  initValue={this.state.price}
                  onChange={this.inputChange}
                  minValue={0}
                  totalWidth={90}
                  totalHeight={40}
                  iconSize={20}
                  step={500}
                  rounded
                  textColor="#B0228C"
                  iconStyle={{ color: "white" }}
                  upDownButtonsBackgroundColor="#EA3788"
                />
              </View>
              <View style={styles.container}>
                <Text style={{ paddingEnd: 20 }}>Có sẵn</Text>
                <Switch
                  value={this.state.available}
                  onValueChange={available => this.setState({ available })}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <Button
                  style={styles.button}
                  title="Xong"
                  onPress={this.saveAndExitEdit}
                />
              </View>
            </View>
          )}
        </View>
      </ThemeProvider>
    );
  }
}

const theme = {
  Text: {
    style: {
      fontSize: 20
    }
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: 100
  }
});

export default connect(
  (state, props) => ({
    product: selectors.data.getProductByIdFromNavigationParam(state, props)
  }),
  dispatch => ({
    doEditProduct: data => dispatch(actions.data.editProduct(data))
  })
)(ProductDetail);

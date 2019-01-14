import { createStackNavigator } from "react-navigation";
import AddProduct from "./AddProduct";
import ProductDetail from "./ProductDetail";
import Products from "./ProductsScreen";
import ImageBrowser from "~/Screens/ImageBrowser";

const ProductStack = createStackNavigator(
  {
    Products,
    AddProduct,
    ProductDetail,
    ImageBrowser
  },
  {
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      if (navigation.state.index > 0) {
        tabBarVisible = false;
      }
      return {
        title: "Sản phẩm",
        tabBarVisible
      };
    },
    defaultNavigationOptions: {
      headerBackTitle: "Danh sách"
    }
  }
);

export default ProductStack;

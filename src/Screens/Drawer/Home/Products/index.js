import { createStackNavigator } from "react-navigation";
import AddProduct from "./AddProduct";
import ProductDetail from "./ProductDetail";
import Products from "./ProductsScreen";

const ProductStack = createStackNavigator(
  {
    Products,
    AddProduct,
    ProductDetail
  },
  {
    navigationOptions: {
      title: "Danh sách sản phẩm"
    },
    defaultNavigationOptions: {
      headerBackTitle: "Danh sách"
    }
  }
);

export default ProductStack;
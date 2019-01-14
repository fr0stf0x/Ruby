import { createStackNavigator } from "react-navigation";
import OrdersScreen from "./OrdersScreen";
import CreateOrder from "./CreateOrder";
import OrderDetail from "./OrderDetail";

const OrdersStack = createStackNavigator(
  {
    OrderList: {
      screen: OrdersScreen
    },
    CreateOrder: {
      screen: CreateOrder
    },
    OrderDetail
  },
  {
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      if (navigation.state.index > 0) {
        tabBarVisible = false;
      }
      return {
        title: "Đặt hàng",
        tabBarVisible
      };
    }
  }
);

export default OrdersStack;

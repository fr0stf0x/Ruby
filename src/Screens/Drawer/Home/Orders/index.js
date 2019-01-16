import { createStackNavigator } from "react-navigation";
import OrdersScreen from "./OrdersScreen";

import OrderDetail from "./OrderDetail";

const OrdersStack = createStackNavigator(
  {
    OrderList: OrdersScreen,
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

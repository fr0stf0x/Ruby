import { createStackNavigator } from "react-navigation";
import OrdersScreen from "./OrdersScreen";
import CreateOrder from "./CreateOrder";

const OrdersStack = createStackNavigator({
  OrderList: {
    screen: OrdersScreen
  },
  CreateOrder: {
    screen: CreateOrder
  }
});

export default OrdersStack;

import { createStackNavigator } from "react-navigation";
import OrdersScreen from "./OrdersScreen";
import CreateOrder from "./CreateOrder";
import OrderDetail from "./OrderDetail";

const OrdersStack = createStackNavigator({
  OrderList: {
    screen: OrdersScreen
  },
  CreateOrder: {
    screen: CreateOrder
  },
  OrderDetail
});

export default OrdersStack;

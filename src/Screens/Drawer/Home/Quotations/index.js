import { createStackNavigator } from "react-navigation";
import QuotationDetail from "./QuotationDetail";
import QuotationsScreen from "./QuotationsScreen";

const QuotationsStack = createStackNavigator(
  {
    QuotationList: {
      screen: QuotationsScreen
    },
    QuotationDetail
  },
  {
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      if (navigation.state.index > 0) {
        tabBarVisible = false;
      }
      return {
        title: "Báo giá",
        tabBarVisible
      };
    },
    defaultNavigationOptions: {
      headerBackTitle: "Danh sách"
    }
  }
);

export default QuotationsStack;

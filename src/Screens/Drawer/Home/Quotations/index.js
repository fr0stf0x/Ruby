import { createStackNavigator } from "react-navigation";
import CreateQuotation from "./CreateQuotation";
import QuotationsScreen from "./QuotationsScreen";
import SelectAgenciesScreen from "./SelectAgenciesScreen";
import QuotationDetail from "./QuotationDetail";

const QuotationsStack = createStackNavigator(
  {
    QuotationList: {
      screen: QuotationsScreen
    },
    CreateQuotation,
    SelectAgencies: {
      screen: SelectAgenciesScreen
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

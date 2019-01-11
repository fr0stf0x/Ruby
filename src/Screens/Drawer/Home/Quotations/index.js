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
    defaultNavigationOptions: {
      headerBackTitle: "Danh sách"
    }
  }
);

export default QuotationsStack;

import { createStackNavigator } from "react-navigation";
import QuotationsScreen from "./QuotationsScreen";
import CreateQuotation from "./CreateQuotation";

const QuotationsStack = createStackNavigator({
  QuotationList: {
    screen: QuotationsScreen
  },
  CreateQuotation: {
    screen: CreateQuotation
  }
});

export default QuotationsStack;

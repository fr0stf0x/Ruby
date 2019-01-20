import { combineReducers } from "redux";
import auth from "./auth";
import appData from "./data";
import ui from "./ui";
import cartReducer from "./cart";
import notifications from "./notification";

export default combineReducers({
  auth,
  ui,
  appData,
  cart: cartReducer,
  notifications
});

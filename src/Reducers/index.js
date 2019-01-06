import { combineReducers } from "redux";
import auth from "./auth";
import appData from "./data";
import ui from "./ui";

export default combineReducers({ auth, ui, appData });

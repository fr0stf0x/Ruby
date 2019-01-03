import types from "../Actions/ActionTypes";
import { mergeObj } from "./utils";
import firebase from "react-native-firebase";

const auth = (
  state = {
    info: {},
    loggedIn: firebase.auth().currentUser !== null,
    error: {
      isError: false,
      message: "",
      code: -1
    }
  },
  action
) => {
  switch (action.type) {
    case types.auth.LOG_IN:
      return mergeObj(state, {
        info: action.payload.info,
        loggedIn: true
      });
    case types.auth.LOG_OUT:
      return mergeObj(state, {
        info: {},
        loggedIn: false
      });
    case types.auth.AUTH_SUCCESS:
      return mergeObj(state, {
        error: {
          isError: false,
          message: "",
          code: -1
        }
      });
    case types.auth.AUTH_ERROR:
      return mergeObj(state, {
        error: {
          isError: true,
          message: action.payload.message,
          code: action.payload.code
        }
      });
    default:
      return state;
  }
};

export default auth;

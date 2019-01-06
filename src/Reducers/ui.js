import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";
import appConstants from "~/appConstants";

const ui = (
  state = {
    isLoading: false,
    appMode: appConstants.mode.MODE_COMPANY
  },
  action
) => {
  switch (action.type) {
    case types.ui.TOGGLE_LOADING:
      return mergeObj(state, {
        isLoading: !state.isLoading
      });
    case types.ui.SET_APP_MODE:
      return mergeObj(state, {
        appMode: action.payload.appMode
      });
    default:
      return state;
  }
};

export default ui;

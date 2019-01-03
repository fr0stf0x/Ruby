import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";

const ui = (
  state = {
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case types.ui.TOGGLE_LOADING:
      return mergeObj(state, {
        isLoading: !state.isLoading
      });
    default:
      return state;
  }
};

export default ui;

import types from "./ActionTypes";

export const toggleLoading = () => {
  return {
    type: types.ui.TOGGLE_LOADING
  };
};

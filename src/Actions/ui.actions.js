import types from "./ActionTypes";
import appConstants from "~/appConstants";

export const toggleLoading = () => {
  return {
    type: types.ui.TOGGLE_LOADING
  };
};

export const setAppMode = ({ group: { group_type } }) => {
  return {
    type: types.ui.SET_APP_MODE,
    payload: { appMode: translateGroupTypeToAppMode(group_type) }
  };
};

const translateGroupTypeToAppMode = groupType => {
  switch (groupType) {
    case appConstants.groupType.AGENCY:
      return appConstants.mode.MODE_AGENCY;
    case appConstants.groupType.RETAIL:
      return appConstants.mode.MODE_RETAIL;
    default:
      return appConstants.mode.MODE_COMPANY;
  }
};

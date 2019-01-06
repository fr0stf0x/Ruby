import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";

const appData = (state = {}, action) => {
  switch (action.type) {
    case types.data.GET_DATA:
      return mergeObj(state, {
        [action.meta.endpoint]: endpoint(state[action.meta.endpoint], action)
      });
    default:
      return state;
  }
};

const endpoint = (state = {}, action) => {
  switch (action.type) {
    case types.data.GET_DATA:
      console.log("getting " + action.meta.endpoint);
      return mergeObj(state, action.payload.data);
    default:
      return state;
  }
};

export default appData;

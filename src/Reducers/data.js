import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";

const appData = (state = {}, action) => {
  switch (action.type) {
    case types.data.INVALIDATE_DATA:
    case types.data.LOAD_DATA:
    case types.data.GET_DATA:
    case types.data.OBSERVE_DATA:
      return mergeObj(state, {
        [action.meta.endpoint]: endpoint(state[action.meta.endpoint], action)
      });
    case types.data.CLEAR_DATA:
      return {};
    default:
      return state;
  }
};

const endpoint = (
  state = {
    loading: false
  },
  action
) => {
  switch (action.type) {
    case types.data.INVALIDATE_DATA:
      return mergeObj(state, {
        loading: false,
        empty: true,
        message: action.payload.message
      });
    case types.data.LOAD_DATA:
      return mergeObj(state, { loading: true });
    case types.data.GET_DATA:
      // console.log("receiving collection " + action.meta.endpoint);
      return mergeObj(state, action.payload.data, {
        empty: false,
        loading: false
      });
    case types.data.OBSERVE_DATA:
      return mergeObj(state, {
        allIds: [...state.allIds, action.payload.id],
        byId: mergeObj(state.byId, {
          [action.payload.id]: action.payload.data
        })
      });
    default:
      return state;
  }
};

export default appData;

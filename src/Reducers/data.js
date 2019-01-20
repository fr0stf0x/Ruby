import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";
import appConstants from "~/appConstants";

const appData = (state = {}, action) => {
  switch (action.type) {
    case types.data.INVALIDATE_DATA:
    case types.data.LOAD_DATA:
    case types.data.GET_DATA:
      return mergeObj(state, {
        [action.meta.endpoint]: endpoint(state[action.meta.endpoint], action)
      });
    case types.data.LOAD_AGENCY_PRODUCTS:
    case types.data.OBSERVE_AGENCY_PRODUCTS:
    case types.data.OBSERVE_DETAIL:
    case types.data.OBSERVE_DATA:
      return mergeObj(state, {
        [action.meta.endpoint]: collection(state[action.meta.endpoint], action)
      });
    case types.data.CLEAR_DATA:
      return {};
    default:
      return state;
  }
};

// TODO classificate docChanges to 3 types: "added", "modified", "removed"
const collection = (
  state = {
    allIds: [],
    byId: {}
  },
  action
) => {
  switch (action.type) {
    case types.data.LOAD_AGENCY_PRODUCTS:
      return mergeObj(state, {
        byId: mergeObj(state.byId, {
          [action.payload.agencyId]: mergeObj(
            state.byId[action.payload.agencyId],
            {
              [appConstants.collection.PRODUCTS]: { loading: true }
            }
          )
        })
      });
    case types.data.OBSERVE_AGENCY_PRODUCTS:
      return mergeObj(state, {
        byId: mergeObj(state.byId, {
          [action.payload.agencyId]: mergeObj(
            state.byId[action.payload.agencyId],
            {
              [appConstants.collection.PRODUCTS]: {
                loading: false,
                allIds: action.payload.productIds
              }
            }
          )
        })
      });
    case types.data.OBSERVE_DATA:
      switch (action.payload.change.type) {
        case "added":
          console.log(
            "data added",
            action.payload.id,
            action.payload.change.data
          );
          return mergeObj(state, {
            allIds: [...state.allIds, action.payload.id],
            byId: mergeObj(state.byId, {
              [action.payload.id]: action.payload.change.data
            })
          });
        case "removed":
          console.log("data removed", action.payload.id);
          // eslint-disable-next-line no-case-declarations
          const index = state.allIds.indexOf(action.payload.id);
          return mergeObj(state, {
            allIds: [
              ...state.allIds.slice(0, index),
              ...state.allIds.slice(index + 1)
            ],
            byId: mergeObj(state.byId, {
              [action.payload.id]: "removed"
            })
          });
        case "modified":
          console.log(
            "data modified",
            state.byId[action.payload.id],
            "->",
            action.payload.change.data
          );
          return mergeObj(state, {
            byId: mergeObj(state.byId, {
              [action.payload.id]: action.payload.change.data
            })
          });
        default:
          return state;
      }
    case types.data.OBSERVE_DETAIL:
      return mergeObj(state, {
        byId: mergeObj(state.byId, {
          [action.payload.id]: mergeObj(state.byId[action.payload.id], {
            detail: action.payload.detail
          })
        })
      });
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
    default:
      return state;
  }
};

export default appData;

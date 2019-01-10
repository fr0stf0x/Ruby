import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";

const products = (state = {}, action) => {
  switch (action.type) {
    case types.cart.TOGGLE_ITEM_CART:
      return mergeObj(state, {
        [action.payload.id]: mergeObj(state[action.payload.id], {
          checked: state[action.payload.id]
            ? state[action.payload.id].checked
              ? !state[action.payload.id].checked
              : true
            : true
        })
      });
    case types.cart.MODIFY_ITEM_IN_CART:
      return mergeObj(state, {
        ...{ [action.payload.id]: !state[action.payload.id] }
      });
    default:
      return state;
  }
};

const agencies = (state = [], action) => {
  switch (action.type) {
    case types.cart.ADD_AGENCY_QUOTATION:
      return [...state, action.payload.id];
    case types.cart.REMOVE_AGENCY_QUOTATION:
      // eslint-disable-next-line no-case-declarations
      let index = state.indexOf(action.payload.id);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    default:
      return state;
  }
};

const endpoint = (state = {}, action) => {
  switch (action.type) {
    case types.cart.TOGGLE_ITEM_CART:
    case types.cart.MODIFY_ITEM_IN_CART:
      return mergeObj(state, {
        products: products(state.products, action)
      });
    default:
      return state;
  }
};

const cartReducer = (
  state = {
    order: {
      products: {}
    },
    quotation: {
      products: {},
      agencies: []
    }
  },
  action
) => {
  switch (action.type) {
    case types.cart.TOGGLE_ITEM_CART:
    case types.cart.MODIFY_ITEM_IN_CART:
      return mergeObj(state, {
        [action.meta.endpoint]: endpoint(state[action.meta.endpoint], action)
      });
    case types.cart.ADD_AGENCY_QUOTATION:
    case types.cart.REMOVE_AGENCY_QUOTATION:
      return mergeObj(state, {
        quotation: mergeObj(state.quotation, {
          agencies: agencies(state.quotation.agencies, action)
        })
      });
    default:
      return state;
  }
};

export default cartReducer;

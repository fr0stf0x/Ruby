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
            : true,
          ...action.payload.data
        })
      });
    case types.cart.MODIFY_ITEM_IN_CART:
      return mergeObj(state, {
        [action.payload.id]: mergeObj(state[action.payload.id], {
          [action.payload.change.name]: action.payload.change.value
        })
      });
    default:
      return state;
  }
};

const agencies = (state = [], action) => {
  switch (action.type) {
    case types.cart.ADD_AGENCIES:
      return action.payload.ids;
    case types.cart.REMOVE_ALL_AGENCY:
      return [];
    case types.cart.ADD_AGENCY:
      return [...state, action.payload.id];
    case types.cart.REMOVE_AGENCY:
      // eslint-disable-next-line no-case-declarations
      let index = state.indexOf(action.payload.id);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    default:
      return state;
  }
};

const endpoint = (state = {}, action) => {
  switch (action.type) {
    case types.cart.CAL_PRICE:
      return mergeObj(state, {
        totalPrice: state.totalPrice + action.payload.totalPrice
      });
    case types.cart.TOGGLE_ITEM_CART:
    case types.cart.MODIFY_ITEM_IN_CART:
      return mergeObj(state, {
        products: products(state.products, action)
      });
    case types.cart.ADD_AGENCIES:
    case types.cart.ADD_AGENCY:
    case types.cart.REMOVE_ALL_AGENCY:
    case types.cart.REMOVE_AGENCY:
      return mergeObj(state, {
        agencies: agencies(state.agencies, action)
      });
    default:
      return state;
  }
};

const cart = {
  order: {
    products: {},
    totalPrice: 0
  },
  quotation: {
    products: {},
    agencies: [],
    totalPrice: 0
  },
  addProducts: {
    products: {},
    agencies: []
  }
};

const cartReducer = (state = cart, action) => {
  switch (action.type) {
    case types.cart.TOGGLE_ITEM_CART:
    case types.cart.MODIFY_ITEM_IN_CART:
    case types.cart.ADD_AGENCY:
    case types.cart.ADD_AGENCIES:
    case types.cart.REMOVE_AGENCY:
    case types.cart.REMOVE_ALL_AGENCY:
    case types.cart.CAL_PRICE:
      return mergeObj(state, {
        [action.meta.endpoint]: endpoint(state[action.meta.endpoint], action)
      });
    case types.cart.CLEAR_CART:
      return cart;
    default:
      return state;
  }
};

export default cartReducer;

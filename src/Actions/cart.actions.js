import types from "./ActionTypes";

export const toggleCheckProduct = ({ id, endpoint }) => ({
  type: types.cart.TOGGLE_ITEM_CART,
  meta: { endpoint },
  payload: { id }
});

export const addAgencyToCart = id => ({
  type: types.cart.ADD_AGENCY_QUOTATION,
  meta: { endpoint: "quotation" },
  payload: { id }
});

export const removeAgencyFromCart = id => ({
  type: types.cart.REMOVE_AGENCY_QUOTATION,
  meta: { endpoint: "quotation" },
  payload: { id }
});

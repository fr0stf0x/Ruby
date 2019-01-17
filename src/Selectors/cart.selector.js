import appConstants from "~/appConstants";

export const getSelectedAgenciesInCart = (
  state,
  endpoint = appConstants.productItemContext.QUOTATION
): Array => state.cart[endpoint].agencies || [];

export const getProductInCart = (state, { endpoint, id }) =>
  state.cart[endpoint].products[id] || {};

export const getProductsInCart = (state, { endpoint }) =>
  state.cart[endpoint].products || {};

export const isCartEmpty = (state, { endpoint }) =>
  Object.keys(getProductsInCart(state, { endpoint })).length === 0;

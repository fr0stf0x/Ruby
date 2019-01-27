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
  Object.entries(getProductsInCart(state, { endpoint })).filter(
    ([id, value]) => value.checked
  ).length === 0;

export const getTotalPrice = (state, { endpoint }) =>
  state.cart[endpoint].totalPrice;

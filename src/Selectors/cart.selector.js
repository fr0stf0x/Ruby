export const getProductInCart = (state, { endpoint, id }) =>
  state.cart[endpoint].products[id];

export const getSelectedAgenciesInCreatingQuotation = (state): Array =>
  state.cart.quotation.agencies;

export const getProductsInCart = (state, { endpoint }) => {
  console.log(state.cart[endpoint].products);
  return state.cart[endpoint].products;
};

export const isCartEmpty = (state, { endpoint }) =>
  getProductsInCart(state, endpoint).allIds.length > 0;

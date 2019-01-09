export const getProductInCart = (state, props) =>
  state.cart[props.endpoint].products[props.id];

export const getAgenciesInCreatingQuotation = state =>
  state.cart.quotation.agencies;

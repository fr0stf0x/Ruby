import types from "./ActionTypes";
import { getSelectedAgenciesInCart } from "~/Selectors/cart.selector";
import { getAgencies } from "~/Selectors/data.selector";
import selectors from "~/Selectors";
import appConstants from "~/appConstants";

export const toggleCheckAllAgencies = (
  endpoint = appConstants.productItemContext.QUOTATION
) => (dispatch, getState) => {
  const state = getState();
  const allAgencies = getAgencies(state);
  const selectedIds = getSelectedAgenciesInCart(state, endpoint);
  if (selectedIds.length > 0) {
    selectedIds.forEach(id => dispatch(removeAgencyFromCart(id, endpoint)));
  } else {
    allAgencies.allIds.forEach(id => dispatch(addAgencyToCart(id, endpoint)));
  }
};

export const toggleCheckAgency = (
  id,
  endpoint = appConstants.productItemContext.QUOTATION
) => (dispatch, getState) => {
  const state = getState();
  const selectedIds = getSelectedAgenciesInCart(state, endpoint);
  return selectedIds.includes(id)
    ? dispatch(removeAgencyFromCart(id, endpoint))
    : dispatch(addAgencyToCart(id, endpoint));
};

export const toggleCheckProduct = ({ id, endpoint }) => ({
  type: types.cart.TOGGLE_ITEM_CART,
  meta: { endpoint },
  payload: { id }
});

export const addAgencyToCartIfNeeded = (
  id,
  endpoint = appConstants.productItemContext.QUOTATION
) => (dispatch, getState) => {
  const state = getState();
  const selectedIds = getSelectedAgenciesInCart(state, endpoint);
  if (!selectedIds.includes(id)) {
    dispatch(addAgencyToCart(id, endpoint));
  }
};

export const addProductToCartIfNeeded = (id, { endpoint }) => (
  dispatch,
  getState
) => {
  const selectedProductIds = selectors.cart.getProductsInCart(getState(), {
    endpoint
  });
  if (!Object.keys(selectedProductIds).includes(id)) {
    dispatch(toggleCheckProduct({ id, endpoint }));
  }
};

export const toggleCheckProducts = (
  allIds: Array,
  { endpoint }
) => dispatch => {
  allIds.forEach(id => dispatch(toggleCheckProduct({ id, endpoint })));
};

export const modifyItemInCart = (id, endpoint, change) => ({
  type: types.cart.MODIFY_ITEM_IN_CART,
  meta: { endpoint },
  payload: { id, change }
});

const addAgencyToCart = (id, endpoint) => {
  return {
    type: types.cart.ADD_AGENCY,
    meta: { endpoint },
    payload: { id }
  };
};

const removeAgencyFromCart = (id, endpoint) => {
  return {
    type: types.cart.REMOVE_AGENCY,
    meta: { endpoint },
    payload: { id }
  };
};

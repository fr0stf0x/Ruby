import types from "./ActionTypes";
import { getSelectedAgenciesInCreatingQuotation } from "~/Selectors/cart.selector";
import { getAgencies } from "~/Selectors/data.selector";
import selectors from "~/Selectors";

export const toggleCheckAllAgencies = () => (dispatch, getState) => {
  const state = getState();
  const selectedIds = getSelectedAgenciesInCreatingQuotation(state);
  const allAgencies = getAgencies(state);
  const isChecked = selectedIds.length > 0;
  if (isChecked) {
    selectedIds.forEach(id => dispatch(removeAgencyFromCart(id)));
  } else {
    allAgencies.allIds.forEach(id => dispatch(addAgencyToCart(id)));
  }
};

export const toggleCheckAgency = id => (dispatch, getState) => {
  const selectedIds = getSelectedAgenciesInCreatingQuotation(getState());
  return selectedIds.includes(id)
    ? dispatch(removeAgencyFromCart(id))
    : dispatch(addAgencyToCart(id));
};

export const toggleCheckProduct = ({ id, endpoint }) => ({
  type: types.cart.TOGGLE_ITEM_CART,
  meta: { endpoint },
  payload: { id }
});

export const addAgencyToCartIfNeeded = id => (dispatch, getState) => {
  const selectedIds = getSelectedAgenciesInCreatingQuotation(getState());
  if (!selectedIds.includes(id)) {
    dispatch(addAgencyToCart(id));
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
    dispatch(toggleCheckProduct(id));
  }
};

export const toggleCheckProducts = (
  allIds: Array,
  { endpoint }
) => dispatch => {
  allIds.forEach(id => dispatch(toggleCheckProduct({ id, endpoint })));
};

const addAgencyToCart = id => {
  console.log("adding " + id);
  return {
    type: types.cart.ADD_AGENCY_QUOTATION,
    payload: { id }
  };
};

const removeAgencyFromCart = id => {
  console.log("removing ", id);
  return {
    type: types.cart.REMOVE_AGENCY_QUOTATION,
    payload: { id }
  };
};

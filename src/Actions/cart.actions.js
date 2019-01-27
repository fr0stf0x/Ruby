import appConstants from "~/appConstants";
import selectors from "~/Selectors";
import {
  getSelectedAgenciesInCart,
  isCartEmpty,
  getProductsInCart
} from "~/Selectors/cart.selector";
import types from "./ActionTypes";

export const toggleCheckAllAgencies = (
  endpoint = appConstants.productItemContext.QUOTATION
) => (dispatch, getState) => {
  const allAgencies = selectors.data.getAgencies(getState());
  const selectedIds = getSelectedAgenciesInCart(getState(), endpoint);
  if (selectedIds.length > 0) {
    dispatch(removeAllAgenciesFromCart(endpoint));
  } else {
    dispatch(addAgenciesToCart(allAgencies.allIds, endpoint));
  }
};

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

export const toggleCheckProducts = (allIds: Array, { endpoint }) => (
  dispatch,
  getState
) => {
  const state = getState();
  const productsInCart = getProductsInCart(state, { endpoint });
  if (isCartEmpty(state, { endpoint })) {
    allIds.forEach(id => dispatch(toggleCheckProduct({ id, endpoint })));
  } else {
    allIds
      .filter(id => productsInCart[id] && productsInCart[id].checked)
      .forEach(id => dispatch(toggleCheckProduct({ id, endpoint })));
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

export const toggleCheckProduct = ({ id, endpoint }) => (
  dispatch,
  getState
) => {
  // type: types.cart.TOGGLE_ITEM_CART,
  // meta: { endpoint },
  // payload: { id },
  const state = getState();
  const { status } = selectors.data.getProductById(state, { id });
  const data = {};
  if (endpoint === appConstants.productItemContext.ORDER) {
    data.count = 10;
    data.totalPrice = (status.price.current || status.price.default) * 10;
  }
  if (endpoint === appConstants.productItemContext.QUOTATION) {
    (data.price = status.price.current || status.price.default),
      (data.offPercent =
        status.off_percent.current || status.off_percent.default);
  }
  dispatch(addProductToCart({ id, endpoint, data }));
};

const addProductToCart = ({ id, endpoint, data }) => {
  return {
    type: types.cart.TOGGLE_ITEM_CART,
    meta: { endpoint },
    payload: { id, data }
  };
};

export const modifyItemInCart = (id, endpoint, change) => ({
  type: types.cart.MODIFY_ITEM_IN_CART,
  meta: { endpoint },
  payload: { id, change }
});

export const addAgenciesToCart = (ids, endpoint) => {
  return {
    type: types.cart.ADD_AGENCIES,
    meta: { endpoint },
    payload: { ids }
  };
};

export const removeAllAgenciesFromCart = endpoint => {
  return {
    type: types.cart.REMOVE_ALL_AGENCY,
    meta: { endpoint }
  };
};

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

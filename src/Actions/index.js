import { makeLogIn, makeLogOut } from "./auth.actions";
import {
  addProduct,
  editProduct,
  initAppData,
  makeCreateOrder,
  makeCreateQuotation,
  makeAddProductsToAgencies,
  makeCreateAgencyAccount,
  acceptNewQuotation,
  rejectNewQuotation,
  acceptNewOrder,
  rejectNewOrder,
  getAgencyProductsIfNeeded
} from "./data.actions";
import { setAppMode, toggleLoading } from "./ui.actions";
import {
  toggleCheckAllAgencies,
  toggleCheckAgency,
  toggleCheckProducts,
  toggleCheckProduct,
  addAgencyToCartIfNeeded,
  addAgenciesToCart,
  modifyItemInCart
} from "./cart.actions";

import {
  addProductsToAgencies,
  globalToggleCheckProducts,
  globalToggleCheckAgencies,
  createQuotation,
  globalToggleLoading
} from "./global";

const actions = {
  auth: {
    makeLogIn,
    makeLogOut
  },
  ui: {
    toggleLoading,
    setAppMode
  },
  data: {
    getAgencyProductsIfNeeded,
    acceptNewOrder,
    rejectNewOrder,
    acceptNewQuotation,
    rejectNewQuotation,
    addProduct,
    editProduct,
    makeCreateOrder,
    makeCreateQuotation,
    makeAddProductsToAgencies,
    makeCreateAgencyAccount,
    initAppData
  },
  cart: {
    addAgencyToCartIfNeeded,
    toggleCheckProducts,
    modifyItemInCart,
    toggleCheckProduct,
    toggleCheckAllAgencies,
    addAgenciesToCart,
    toggleCheckAgency
  },
  global: {
    globalToggleLoading,
    addProductsToAgencies,
    globalToggleCheckProducts,
    globalToggleCheckAgencies,
    createQuotation
  }
};

export default actions;

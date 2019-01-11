import { makeLogIn, makeLogOut } from "./auth.actions";
import {
  addProduct,
  initAppData,
  makeCreateOrder,
  makeCreateQuotation,
  makeAddProductsToAgency,
  makeCreateAgencyAccount,
  acceptNewQuotation,
  rejectNewQuotation,
  acceptNewOrder,
  rejectNewOrder
} from "./data.actions";
import { setAppMode, toggleLoading } from "./ui.actions";
import {
  toggleCheckAllAgencies,
  toggleCheckAgency,
  toggleCheckProducts,
  toggleCheckProduct,
  addAgencyToCartIfNeeded,
  modifyItemInCart
} from "./cart.actions";

import {
  globalToggleCheckProducts,
  globalToggleCheckAgencies,
  createQuotation
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
    acceptNewOrder,
    rejectNewOrder,
    acceptNewQuotation,
    rejectNewQuotation,
    addProduct,
    makeCreateOrder,
    makeCreateQuotation,
    makeAddProductsToAgency,
    makeCreateAgencyAccount,
    initAppData
  },
  cart: {
    addAgencyToCartIfNeeded,
    toggleCheckProducts,
    modifyItemInCart,
    toggleCheckProduct,
    toggleCheckAllAgencies,
    toggleCheckAgency
  },
  global: {
    globalToggleCheckProducts,
    globalToggleCheckAgencies,
    createQuotation
  }
};

export default actions;

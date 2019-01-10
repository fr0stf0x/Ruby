import { makeLogIn, makeLogOut } from "./auth.actions";
import {
  addProduct,
  initAppData,
  makeCreateAgencyAccount
} from "./data.actions";
import { setAppMode, toggleLoading } from "./ui.actions";
import {
  toggleCheckAllAgencies,
  toggleCheckAgency,
  toggleCheckProducts,
  toggleCheckProduct,
  addAgencyToCartIfNeeded
} from "./cart.actions";

import { globalToggleCheckProducts, globalToggleCheckAgencies } from "./global";

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
    addProduct,
    makeCreateAgencyAccount,
    initAppData
  },
  cart: {
    addAgencyToCartIfNeeded,
    toggleCheckProducts,
    toggleCheckProduct,
    toggleCheckAllAgencies,
    toggleCheckAgency
  },
  global: {
    globalToggleCheckProducts,
    globalToggleCheckAgencies
  }
};

export default actions;

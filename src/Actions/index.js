import { makeLogIn, makeLogOut } from "./auth.actions";
import {
  addProduct,
  initAppData,
  makeCreateAgencyAccount
} from "./data.actions";
import { setAppMode, toggleLoading } from "./ui.actions";
import {
  toggleCheckProduct,
  addAgencyToCart,
  removeAgencyFromCart
} from "./cart.actions";

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
    toggleCheckProduct,
    addAgencyToCart,
    removeAgencyFromCart
  }
};

export default actions;

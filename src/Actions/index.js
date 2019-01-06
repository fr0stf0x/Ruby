import { makeLogIn, makeLogOut } from "./auth.actions";
import { toggleLoading, setAppMode } from "./ui.actions";
import {
  makeCreateAgencyAccount,
  initAppData,
  addProduct
} from "./data.actions";

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
  }
};

export default actions;

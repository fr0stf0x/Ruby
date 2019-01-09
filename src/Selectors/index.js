import { getAuthError, isUserLoggedIn, getAuthInfo } from "./auth.selector";
import {
  getProductByIdFromNavigationParam,
  getProducts,
  getUserProfile,
  getGroupInfo,
  getParent,
  getAgencies
} from "./data.selector";
import { isLoading, getAppMode } from "./ui.selector";
import {
  getProductInCart,
  getAgenciesInCreatingQuotation
} from "./cart.selector";

const selectors = {
  auth: {
    isUserLoggedIn,
    getAuthError,
    getAuthInfo
  },
  ui: {
    isLoading,
    getAppMode
  },
  data: {
    getGroupInfo,
    getParent,
    getAgencies,
    getUserProfile,
    getProducts,
    getProductByIdFromNavigationParam
  },
  cart: {
    getAgenciesInCreatingQuotation,
    getProductInCart
  }
};

export default selectors;

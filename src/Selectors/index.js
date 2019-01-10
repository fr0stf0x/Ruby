import { getAuthError, isUserLoggedIn, getAuthInfo } from "./auth.selector";
import {
  getProductByIdFromNavigationParam,
  getProductsByType,
  getUserProfile,
  getGroupInfo,
  getParent,
  getAgencies
} from "./data.selector";
import { isLoading, getAppMode } from "./ui.selector";
import {
  getProductInCart,
  getProductsInCart,
  isCartEmpty,
  getSelectedAgenciesInCreatingQuotation
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
    getProductsByType,
    getProductByIdFromNavigationParam
  },
  cart: {
    getProductInCart,
    getProductsInCart,
    isCartEmpty,
    getSelectedAgenciesInCreatingQuotation
  }
};

export default selectors;

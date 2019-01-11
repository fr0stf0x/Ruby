import { getAuthError, isUserLoggedIn, getAuthInfo } from "./auth.selector";
import {
  getProductByIdFromNavigationParam,
  getProductsByType,
  getUserProfile,
  getGroupInfo,
  getParent,
  getAgencies,
  getAgencyByIdFromNavigationParam,
  getQuotations,
  getOrders
} from "./data.selector";
import { isLoading, getAppMode } from "./ui.selector";
import {
  getProductInCart,
  getProductsInCart,
  isCartEmpty,
  getSelectedAgenciesInCart
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
    getOrders,
    getAgencyByIdFromNavigationParam,
    getGroupInfo,
    getQuotations,
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
    getSelectedAgenciesInCart
  }
};

export default selectors;

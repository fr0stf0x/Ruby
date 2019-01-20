import { getAuthError, isUserLoggedIn, getAuthInfo } from "./auth.selector";
import {
  getProductByIdFromNavigationParam,
  getProductIdsByType,
  getProductsOfAgency,
  getUserProfile,
  getGroupInfo,
  getParent,
  getAgencies,
  getAgencyByIdFromNavigationParam,
  getProducts,
  getQuotations,
  getOrders,
  getProductById,
  getOrderByIdFromNavigationParam,
  getOrderById,
  getQuotationById,
  getQuotationByIdFromNavigationParam
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
    getProductById,
    getOrders,
    getAgencyByIdFromNavigationParam,
    getGroupInfo,
    getQuotations,
    getProducts,
    getParent,
    getAgencies,
    getUserProfile,
    getProductsOfAgency,
    getProductIdsByType,
    getOrderById,
    getQuotationById,
    getProductByIdFromNavigationParam,
    getOrderByIdFromNavigationParam,
    getQuotationByIdFromNavigationParam
  },
  cart: {
    getProductInCart,
    getProductsInCart,
    isCartEmpty,
    getSelectedAgenciesInCart
  }
};

export default selectors;

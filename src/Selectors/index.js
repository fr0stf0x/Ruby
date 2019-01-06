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
  }
};

export default selectors;

import { getAuthError, isUserLoggedIn, getAuthInfo } from "./auth.selector";
import {
  getProductByIdFromNavigationParam,
  getProducts,
  getUserProfile,
  getGroupInfo,
  getParent,
  getChildren
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
    getChildren,
    getUserProfile,
    getProducts,
    getProductByIdFromNavigationParam
  }
};

export default selectors;

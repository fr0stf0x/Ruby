const LOG_IN = "logIn";
const LOG_OUT = "logOut";
const AUTH_ERROR = "auth_error";
const AUTH_SUCCESS = "auth_success";

const SET_PRODUCT_ITEM_CONTEXT = "set_product_context";
const TOGGLE_LOADING = "toggle_loading";

const CLEAR_DATA = "clear_data";
const INVALIDATE_DATA = "invalidate_data";
const LOAD_DATA = "load_data";
const GET_DATA = "get_data";
const OBSERVE_DATA = "observe_data";
const OBSERVE_DETAIL = "observe_detail";
const LOAD_AGENCY_PRODUCTS = "load_agency_products";
const OBSERVE_AGENCY_PRODUCTS = "observe_agency_products";

const SET_APP_MODE = "set_app_mode";

const CLEAR_CART = "clear_cart";
const CAL_PRICE = "cal_price";
const ADD_AGENCY = "add_agency";
const ADD_AGENCIES = "add_agencies";
const REMOVE_AGENCY = "remove_agency";
const REMOVE_ALL_AGENCY = "remove_all_agency";
const TOGGLE_ADD_AGENCY = "toggle_add_agency";
const TOGGLE_ITEM_CART = "toggle_item_cart";
const ADD_ITEM_TO_CART = "add_item_cart";
const MODIFY_ITEM_IN_CART = "modify_item_cart";
const REMOVE_ITEM_FROM_CART = "remove_item_cart";

const NEW_NOTIFICATION = "new_notification";
const SEEN_NOTIFICATION = "seen_notification";

const types = {
  auth: {
    LOG_IN,
    LOG_OUT,
    AUTH_ERROR,
    AUTH_SUCCESS
  },
  ui: {
    TOGGLE_LOADING,
    SET_APP_MODE,
    SET_PRODUCT_ITEM_CONTEXT
  },
  data: {
    CLEAR_DATA,
    INVALIDATE_DATA,
    LOAD_DATA,
    GET_DATA,
    OBSERVE_DATA,
    OBSERVE_DETAIL,
    LOAD_AGENCY_PRODUCTS,
    OBSERVE_AGENCY_PRODUCTS
  },
  cart: {
    CLEAR_CART,
    CAL_PRICE,
    ADD_AGENCIES,
    TOGGLE_ADD_AGENCY,
    ADD_AGENCY,
    REMOVE_ALL_AGENCY,
    REMOVE_AGENCY,
    TOGGLE_ITEM_CART,
    ADD_ITEM_TO_CART,
    MODIFY_ITEM_IN_CART,
    REMOVE_ITEM_FROM_CART
  },
  notification: {
    NEW_NOTIFICATION,
    SEEN_NOTIFICATION
  }
};

export default types;

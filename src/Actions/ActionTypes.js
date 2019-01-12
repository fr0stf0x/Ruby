const LOG_IN = "logIn";
const LOG_OUT = "logOut";
const AUTH_ERROR = "auth_error";
const AUTH_SUCCESS = "auth_success";

const SET_PRODUCT_ITEM_CONTEXT = "set_product_context";
const TOGGLE_LOADING = "toggle_loading";

const INVALIDATE_DATA = "invalidate_data";
const LOAD_DATA = "load_data";
const GET_DATA = "get_data";
const OBSERVE_DATA = "observe_data";

const SET_APP_MODE = "set_app_mode";

const ADD_AGENCY = "add_agency";
const REMOVE_AGENCY = "remove_agency";
const TOGGLE_ADD_AGENCY = "toggle_add_agency";
const TOGGLE_ITEM_CART = "toggle_item_cart";
const ADD_ITEM_TO_CART = "add_item_cart";
const MODIFY_ITEM_IN_CART = "modify_item_cart";
const REMOVE_ITEM_FROM_CART = "remove_item_cart";

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
    INVALIDATE_DATA,
    LOAD_DATA,
    GET_DATA,
    OBSERVE_DATA
  },
  cart: {
    TOGGLE_ADD_AGENCY,
    ADD_AGENCY,
    REMOVE_AGENCY,
    TOGGLE_ITEM_CART,
    ADD_ITEM_TO_CART,
    MODIFY_ITEM_IN_CART,
    REMOVE_ITEM_FROM_CART
  }
};

export default types;

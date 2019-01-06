const LOG_IN = "logIn";
const LOG_OUT = "logOut";
const AUTH_ERROR = "auth_error";
const AUTH_SUCCESS = "auth_success";

const TOGGLE_LOADING = "toggle_loading";

const GET_DATA = "get_data";
const OBSERVE_DATA = "observe_data";

const SET_APP_MODE = "set_app_mode";

const types = {
  auth: {
    LOG_IN,
    LOG_OUT,
    AUTH_ERROR,
    AUTH_SUCCESS
  },
  ui: {
    TOGGLE_LOADING,
    SET_APP_MODE
  },
  data: {
    GET_DATA,
    OBSERVE_DATA
  }
};

export default types;

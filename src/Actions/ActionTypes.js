const LOG_IN = "logIn";
const LOG_OUT = "logOut";
const AUTH_ERROR = "auth_error";
const AUTH_SUCCESS = "auth_success";

const TOGGLE_LOADING = "toggle_loading";

const types = {
  auth: {
    LOG_IN,
    LOG_OUT,
    AUTH_ERROR,
    AUTH_SUCCESS
  },
  ui: {
    TOGGLE_LOADING
  }
};

export default types;

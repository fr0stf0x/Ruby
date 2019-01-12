import firebase from "react-native-firebase";
import types from "./ActionTypes";
import { setAccountToAsyncStorage } from "./global";
import { toggleLoading } from "./ui.actions";

const login = ({ user: info }) => {
  return {
    type: types.auth.LOG_IN,
    payload: {
      info
    }
  };
};

const logOut = () => {
  return {
    type: types.auth.LOG_OUT
  };
};

const authError = ({ code, message }) => {
  return {
    type: types.auth.AUTH_ERROR,
    payload: { code, message }
  };
};

const authSuccess = () => {
  return {
    type: types.auth.AUTH_SUCCESS
  };
};

export const makeLogIn = ({ email, password }) => dispatch => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      dispatch(login({ user }));
      dispatch(authSuccess());
      return setAccountToAsyncStorage({ email, password });
    })
    .catch(err => {
      const { code, message } = err;
      dispatch(authError({ code, message }));
      return Promise.reject(err);
    });
};

export const makeLogOut = () => dispatch => {
  dispatch(toggleLoading());
  return firebase
    .auth()
    .signOut()
    .then(res => {
      dispatch(logOut());
      dispatch(authSuccess());
      // navigate("Login");
    })
    .finally(() => {
      dispatch(toggleLoading());
    });
};

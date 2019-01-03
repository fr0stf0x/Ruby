import types from "./ActionTypes";
import firebase from "react-native-firebase";
import { AsyncStorage } from "react-native";
import { toggleLoading } from "./ui.actions";

const login = ({ user: info, account }) => {
  setAsyncStorage(account);
  return {
    type: types.auth.LOG_IN,
    payload: {
      info
    }
  };
};

const setAsyncStorage = async ({ email, password }) => {
  try {
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", password);
  } catch (error) {
    // Error saving data
  }
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
  dispatch(toggleLoading());
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      dispatch(login({ user, account: { email, password } }));
      dispatch(authSuccess());
      return { user };
    })
    .catch(err => {
      const { code, message } = err;
      dispatch(authError({ code, message }));
    })
    .finally(() => {
      dispatch(toggleLoading());
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
      return res;
    })
    .finally(() => {
      dispatch(toggleLoading());
    });
};

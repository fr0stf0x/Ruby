import firebase from "react-native-firebase";
import types from "./ActionTypes";
import { setAccountToAsyncStorage } from "./global";
import selectors from "~/Selectors";

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

export const makeLogIn = ({ email, password }) => dispatch =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // firebase.messaging().subscribeToTopic("/topics/ruby");
      dispatch(login({ user }));
      dispatch(authSuccess());
      return setAccountToAsyncStorage({ email, password });
    })
    .catch(err => {
      console.log(err);
      const { code, message } = err;
      dispatch(authError({ code, message }));
      return Promise.reject(err);
    });

export const makeLogOut = () => (dispatch, getState) =>
  firebase
    .auth()
    .signOut()
    .then(() => {
      // firebase.messaging().unsubscribeFromTopic("/topics/ruby");
      firebase
        .messaging()
        .unsubscribeFromTopic(
          `/topics/${selectors.data.getGroupInfo(getState()).id}`
        );
      dispatch(logOut());
      dispatch(authSuccess());
    });

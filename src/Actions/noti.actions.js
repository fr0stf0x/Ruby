import types from "./ActionTypes";

export const fireNewNotification = ({ id, type, content }) => {
  return {
    type: types.notification.NEW_NOTIFICATION,
    meta: { type },
    payload: { id, content }
  };
};

export const seenNotification = ({ id }) => {
  return {
    type: types.notification.SEEN_NOTIFICATION,
    payload: { id }
  };
};

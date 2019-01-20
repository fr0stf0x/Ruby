import types from "~/Actions/ActionTypes";
import { mergeObj } from "./utils";

const notifications = (
  state = {
    allIds: [],
    byId: {}
  },
  action
) => {
  switch (action.type) {
    case types.notification.NEW_NOTIFICATION:
      return mergeObj(state, {
        allIds: [...state.allIds, action.payload.id],
        byId: mergeObj(state.byId, {
          [action.payload.id]: {
            seen: false,
            type: action.meta.type,
            content: action.payload.content,
            receivedAt: new Date()
          }
        })
      });
    case types.notification.SEEN_NOTIFICATION:
      return mergeObj(state, {
        byId: mergeObj(state.byId, {
          [action.payload.id]: {
            seen: true,
            seenAt: new Date()
          }
        })
      });
    default:
      return state;
  }
};

export default notifications;

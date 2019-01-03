import { makeLogIn, makeLogOut } from "./auth.actions";
import { toggleLoading } from "./ui.actions";

const actions = {
  auth: {
    makeLogIn,
    makeLogOut
  },
  ui: {
    toggleLoading
  }
};

export default actions;

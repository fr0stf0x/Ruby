import { isUserLoggedIn, authError, userInfo } from "./auth.selector";
import { isLoading } from "./ui.selector";

const selectors = {
  auth: { isUserLoggedIn, authError, userInfo },
  ui: { isLoading }
};

export default selectors;

import { isUserLoggedIn, authError } from "./auth.selector";
import { isLoading } from "./ui.selector";

const selectors = {
  auth: { isUserLoggedIn, authError },
  ui: { isLoading }
};

export default selectors;

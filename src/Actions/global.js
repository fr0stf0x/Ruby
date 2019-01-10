import selectors from "~/Selectors";
import store from "~/configureStore";
import { toggleCheckProducts, toggleCheckAllAgencies } from "./cart.actions";

export const globalToggleCheckProducts = () => {
  const products = selectors.data.getProductsByType(store.getState(), {
    type: "available"
  }).allIds;
  return store.dispatch(
    toggleCheckProducts(products, { endpoint: "quotation" })
  );
};

export const globalToggleCheckAgencies = () => {
  store.dispatch(toggleCheckAllAgencies());
};

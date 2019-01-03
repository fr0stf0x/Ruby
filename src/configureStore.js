import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import RubyReducers from "~/Reducers/";

const configureStore = preloadedState =>
  createStore(
    RubyReducers,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk))
  );

export default configureStore;

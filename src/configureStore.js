import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import RubyReducers from "~/Reducers/";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  RubyReducers,
  {},
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

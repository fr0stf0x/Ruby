import appConstants from "~/appConstants";

// data collection
export const getAgencies = state =>
  state.appData[appConstants.collection.CHILDREN] || {};

export const getQuotations = state =>
  state.appData[appConstants.collection.QUOTATIONS] || {};

export const getOrders = state =>
  state.appData[appConstants.collection.ORDERS] || {};

export const getProducts = state =>
  state.appData[appConstants.collection.PRODUCTS] || {};

export const getProductIdsByType = (state, { type = "all" }) => {
  const products = getProducts(state);
  if (!products.allIds) return [];
  const { allIds, byId } = products;
  if (type === "all") return allIds;
  return allIds.filter(
    id => byId[id].status.available === (type === "available")
  );
};

// data endpoints
export const getUserProfile = state =>
  state.appData[appConstants.dataEndpoint.USER_PROFILE];

export const getGroupInfo = state =>
  state.appData[[appConstants.dataEndpoint.GROUP_INFO]];

export const getParent = state =>
  state.appData[appConstants.dataEndpoint.PARENT];

// piece of collection
export const getProductById = (state, { id }) => getProducts(state).byId[id];

export const getAgencyById = (state, { id }) => getAgencies(state).byId[id];

export const getQuotationById = (state, { id }) =>
  getQuotations(state).byId[id];

export const getOrderById = (state, { id }) => getOrders(state).byId[id];

export const getProductByIdFromNavigationParam = (state, props) =>
  getProductById(state, { id: props.navigation.getParam("id") });

export const getAgencyByIdFromNavigationParam = (state, props) =>
  getAgencyById(state, { id: props.navigation.getParam("id") });

export const getOrderByIdFromNavigationParam = (state, props) =>
  getOrderById(state, { id: props.navigation.getParam("id") });

export const getQuotationByIdFromNavigationParam = (state, props) =>
  getQuotationById(state, { id: props.navigation.getParam("id") });

export const getProductsOfAgency = (state, { id }) =>
  getAgencyById(state, { id })[appConstants.collection.PRODUCTS];

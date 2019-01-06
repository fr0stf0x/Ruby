import appConstants from "~/appConstants";

// data collection
export const getAgencies = state =>
  state.appData[appConstants.collection.CHILDREN];

export const getProducts = state =>
  state.appData[[appConstants.collection.PRODUCTS]];

// data endpoints
export const getUserProfile = state =>
  state.appData[appConstants.dataEndpoint.USER_PROFILE];

export const getGroupInfo = state =>
  state.appData[[appConstants.dataEndpoint.GROUP_INFO]];

export const getParent = state =>
  state.appData[appConstants.dataEndpoint.PARENT];

// piece of collection
export const getProductByIdFromNavigationParam = (state, props) =>
  state.appData[appConstants.collection.PRODUCTS].byId[
    props.navigation.getParam("id", -1)
  ];

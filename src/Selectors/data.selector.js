import appConstants from "~/appConstants";

// data collection
export const getAgencies = state =>
  state.appData[appConstants.collection.CHILDREN];

export const getProducts = (state, props) => {
  const { type } = props || { type: "all" };
  console.log(type);
  const products = state.appData[appConstants.collection.PRODUCTS];
  if (type === "all") return products;
  const { allIds, byId } = products;
  const newAllIds = allIds.filter(
    id => byId[id].status.available === (type === "available")
  );
  return {
    allIds: newAllIds,
    byId: newAllIds.reduce((obj, id) => {
      obj[id] = byId[id];
      return obj;
    }, {})
  };
};

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

import appConstants from "~/appConstants";

// data collection
export const getAgencies = state =>
  state.appData[appConstants.collection.CHILDREN];

export const getQuotations = state =>
  state.appData[appConstants.collection.QUOTATIONS];

export const getOrders = state => state.appData[appConstants.collection.ORDERS];

export const getProductsByType = (state, { type = "all" }) => {
  const products = state.appData[appConstants.collection.PRODUCTS];
  if (products) {
    if (type === "all") return products;
    const { allIds, byId, loading } = products;
    const newAllIds = allIds.filter(
      id => byId[id].status.available === (type === "available")
    );
    return {
      loading,
      allIds: newAllIds,
      byId: newAllIds.reduce((obj, id) => {
        obj[id] = byId[id];
        return obj;
      }, {})
    };
  }
  return null;
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
    props.navigation.getParam("id")
  ];

export const getProductById = (state, { id }) =>
  state.appData[appConstants.collection.PRODUCTS].byId[id];

export const getAgencyByIdFromNavigationParam = (state, props) =>
  state.appData[appConstants.collection.CHILDREN].byId[
    props.navigation.getParam("id")
  ];

export const getOrderByIdFromNavigationParam = (state, props) =>
  state.appData[appConstants.collection.ORDERS].byId[
    props.navigation.getParam("id")
  ];

export const getQuotationByIdFromNavigationParam = (state, props) =>
  state.appData[appConstants.collection.QUOTATIONS].byId[
    props.navigation.getParam("id")
  ];

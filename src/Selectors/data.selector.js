export const getUserProfile = state => state.appData.userProfile;

export const getProducts = state => state.appData.products;

export const getProductByIdFromNavigationParam = (state, props) =>
  state.appData.products.byId[props.navigation.getParam("id", -1)];

export const getGroupInfo = state => state.appData.groupInfo;

export const getParent = state => state.appData.parent;
export const getChildren = state => state.appData.children;

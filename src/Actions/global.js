import { AsyncStorage } from "react-native";
import firebase from "react-native-firebase";
import appConstants from "~/appConstants";
import store from "~/configureStore";
import selectors from "~/Selectors";
import { toggleCheckAllAgencies, toggleCheckProducts } from "./cart.actions";
import { toggleLoading } from "./ui.actions";

export const setAccountToAsyncStorage = async ({ email, password }) => {
  try {
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", password);
  } catch (error) {
    console.log(error);
  }
};

export const globalToggleCheckProducts = (
  endpoint = appConstants.productItemContext.QUOTATION
) => {
  const products = selectors.data.getProductIdsByType(store.getState(), {
    type: "available"
  });
  return store.dispatch(toggleCheckProducts(products, { endpoint }));
};

export const globalToggleCheckAgencies = () => {
  store.dispatch(toggleCheckAllAgencies());
};

export const addProductsToAgencies = productsInAgencies => (
  dispatch,
  getState
) => {
  console.log(productsInAgencies);
  Object.entries(productsInAgencies).forEach(([agencyId, value]) => {
    if (Object.keys(value).length === 0) {
      return Promise.reject("Chưa chọn sản phẩm");
    }
  });
  const state = getState();
  const db = firebase.firestore();
  const batch = db.batch();
  Object.entries(productsInAgencies).forEach(([agencyId, value]) => {
    const agencyRef = db
      .collection(appConstants.collection.GROUPS)
      .doc(agencyId);
    console.log(value);
    value.forEach(productId => {
      const productInfo = selectors.data.getProductById(state, {
        id: productId
      });
      console.log(productInfo);
      const productRefInAgency = agencyRef
        .collection(appConstants.collection.PRODUCTS)
        .doc(productId);
      batch.set(productRefInAgency, {
        createdAt: new Date(),
        status: {
          available: true,
          price: {
            default: productInfo.status.price.default
          },
          off_percent: {
            default: productInfo.status.off_percent.default
          }
        }
      });
    });
  });
  return batch.commit();
};

export const createQuotation = (agencyIds: Array, products) => {
  if (agencyIds.length === 0) {
    return Promise.reject("Chưa chọn đại lý");
  }
  if (Object.keys(products).length === 0) {
    return Promise.reject("Chưa chọn sản phẩm để báo giá");
  }
  const db = firebase.firestore();
  const batch = db.batch();
  const status = {
    verified: false
  };
  const createdAt = new Date();
  const currentGroupId = selectors.data.getGroupInfo(store.getState()).id;
  agencyIds.forEach(agencyId => {
    const childRef = db
      .collection(appConstants.collection.GROUPS)
      .doc(agencyId);
    const newOrderDocRef = db.collection(appConstants.collection.ORDERS).doc();
    const orderDocRefInChild = childRef
      .collection(appConstants.collection.QUOTATIONS)
      .doc(newOrderDocRef.id);
    batch.set(newOrderDocRef, {
      products,
      createdAt,
      from: currentGroupId,
      to: agencyId
    });
    batch.set(orderDocRefInChild, { status, createdAt });
  });
  return batch.commit();
};

export const createOrder = (parentId, products) => {
  if (Object.keys(products).length === 0) {
    return Promise.reject("Chưa chọn sản phẩm để báo giá");
  }
  const db = firebase.firestore();
  const batch = db.batch();
  const status = {
    verified: false
  };
  const createdAt = new Date();
  const currentGroup = selectors.data.getGroupInfo(store.getState());

  const parentRef = db.collection(appConstants.collection.GROUPS).doc(parentId);
  const newOrderDocRef = db.collection(appConstants.collection.ORDERS).doc();
  const orderDocRefInParent = parentRef
    .collection(appConstants.collection.ORDERS)
    .doc(newOrderDocRef.id);
  batch.set(newOrderDocRef, {
    products,
    createdAt,
    from: currentGroup.id,
    to: parentId
  });
  batch.set(orderDocRefInParent, {
    status,
    createdAt,
    from: currentGroup.name
  });
  return batch.commit();
};

export const globalToggleLoading = () => {
  return store.dispatch(toggleLoading());
};

export const promiseWithLoadingAnimation = promise => {
  globalToggleLoading();
  promise().finally(globalToggleLoading);
};

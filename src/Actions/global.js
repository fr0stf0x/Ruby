import { AsyncStorage } from "react-native";
import firebase from "react-native-firebase";
import appConstants from "~/appConstants";
import store from "~/configureStore";
import selectors from "~/Selectors";
import { toggleCheckAllAgencies, toggleCheckProducts } from "./cart.actions";
import { toggleLoading } from "./ui.actions";
import { promiseWrapper } from "~/Utils/utils";

export const setAccountToAsyncStorage = async ({ email, password }) => {
  try {
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", password);
  } catch (error) {
    console.log(error);
  }
};

export const setImageToAsyncStorage = async (id, imageUri) => {
  try {
    await AsyncStorage.setItem(`@Images/${id}`, imageUri);
  } catch (error) {
    console.log(error);
  }
};

export const getImageFromAsyncStorage = async id => {
  const { data: image, error } = await promiseWrapper(
    AsyncStorage.getItem(`@Images/${id}`)
  );
  if (!error) {
    return image;
  }
};

export const globalToggleCheckProducts = (
  endpoint = appConstants.productItemContext.QUOTATION
) => {
  const allProducts = selectors.data.getProducts(store.getState());
  if (allProducts && allProducts.allIds) {
    const productIds = selectors.data.getProductIdsByType(store.getState(), {
      type: "available"
    });
    return store.dispatch(toggleCheckProducts(productIds, { endpoint }));
  }
};

export const globalToggleCheckAgencies = () => {
  const agencies = selectors.data.getAgencies(store.getState());
  if (agencies && agencies.allIds) store.dispatch(toggleCheckAllAgencies());
};

export const addProductsToAgencies = productsInAgencies => (
  dispatch,
  getState
) => {
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
  const currentGroup = selectors.data.getGroupInfo(store.getState());
  const currentGroupQuotationCollectionRef = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id)
    .collection(appConstants.collection.QUOTATIONS);
  console.log("agencies", agencyIds);
  agencyIds.forEach(agencyId => {
    const childRef = db
      .collection(appConstants.collection.GROUPS)
      .doc(agencyId);
    const centralOrderDocRef = db
      .collection(appConstants.collection.ORDERS)
      .doc();
    const quotationRefInChild = childRef
      .collection(appConstants.collection.QUOTATIONS)
      .doc(centralOrderDocRef.id);
    batch.set(quotationRefInChild, {
      createdAt,
      type: "received"
    });
    batch.set(currentGroupQuotationCollectionRef.doc(centralOrderDocRef.id), {
      createdAt,
      type: "going"
    });
    // central doc
    batch.set(centralOrderDocRef, {
      status,
      products,
      createdAt,
      from: currentGroup.id,
      to: agencyId
    });
  });
  return batch.commit();
};

export const createOrder = (parentId, products, totalPrice) => {
  if (
    Object.entries(products).filter(([id, value]) => value.checked).length === 0
  ) {
    return Promise.reject("Chưa chọn sản phẩm để đặt hàng");
  }
  const db = firebase.firestore();
  const batch = db.batch();
  const status = {
    verified: false
  };
  const createdAt = new Date();
  const currentGroup = selectors.data.getGroupInfo(store.getState());

  const parentRef = db.collection(appConstants.collection.GROUPS).doc(parentId);
  const centralOrderDocRef = db
    .collection(appConstants.collection.ORDERS)
    .doc();
  const orderDocRefInCurrentGroup = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id)
    .collection(appConstants.collection.ORDERS)
    .doc(centralOrderDocRef.id);
  const orderDocRefInParent = parentRef
    .collection(appConstants.collection.ORDERS)
    .doc(centralOrderDocRef.id);
  batch.set(orderDocRefInCurrentGroup, {
    createdAt,
    type: "going"
  });
  batch.set(orderDocRefInParent, {
    createdAt,
    from: currentGroup.name,
    type: "received"
  });
  batch.set(centralOrderDocRef, {
    status,
    products,
    createdAt,
    from: currentGroup.id,
    to: parentId,
    totalPrice
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

// @flow

// eslint-disable-next-line import/named
import { Platform } from "react-native";
import firebase from "react-native-firebase";
import appConstants from "~/appConstants";
import selectors from "~/Selectors";
import { promiseWrapper } from "~/Utils/utils";
import types from "./ActionTypes";
import { addProductsToAgency, createOrder, createQuotation } from "./global";
import { setAppMode } from "./ui.actions";

import type { QuerySnapshot, DocumentReference } from "react-native-firebase";

// how to ignore warning /^(?!Require cycle).*$/
// TODO add product type

export const initAppData = ({ uid }) => async dispatch => {
  // // console.log("init app data");
  const { data: snapshot, error } = await promiseWrapper(
    firebase
      .firestore()
      .collection(appConstants.collection.USERS)
      .doc(uid)
      .get()
  );
  if (!error && snapshot.exists) {
    const userProfile = snapshot.data();
    dispatch(
      receiveData({
        endpoint: "userProfile",
        data: { [uid]: userProfile }
      })
    );
    dispatch(setAppMode(userProfile));
    dispatch(getAppData(userProfile));
  }
};

const subscribeToTopic = async groupInfo => {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    // user has a device token
    console.log("have token");
  } else {
    // user doesn't have a device token yet
  }
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    // user has permissions
    console.log(`subscribing to /topics/${groupInfo.id}`);
    firebase.messaging().subscribeToTopic(`/topics/${groupInfo.id}`);
  }
};

export const makeAddProductsToAgency = () => (dispatch, getState) => {
  const state = getState();
  const agencyId = selectors.cart.getSelectedAgenciesInCart(
    state,
    appConstants.productItemContext.ADD_TO_AGENCY
  );
  const selectedProducts = selectors.cart.getProductsInCart(state, {
    endpoint: appConstants.productItemContext.ADD_TO_AGENCY
  });
  return dispatch(addProductsToAgency(agencyId, selectedProducts));
};

export const makeCreateQuotation = () => (dispatch, getState) => {
  const state = getState();
  const selectedAgencyIds = selectors.cart.getSelectedAgenciesInCart(state);
  console.log("agencies", selectedAgencyIds);
  const selectedProducts = selectors.cart.getProductsInCart(state, {
    endpoint: appConstants.productItemContext.QUOTATION
  });
  console.log("products", selectedProducts);
  return createQuotation(selectedAgencyIds, selectedProducts);
};

export const makeCreateOrder = () => (dispatch, getState) => {
  const state = getState();
  const parentId = selectors.data.getParent(state).info.id;
  const selectedProducts = selectors.cart.getProductsInCart(state, {
    endpoint: appConstants.productItemContext.ORDER
  });
  console.log("products", selectedProducts);
  return dispatch(createOrder(parentId, selectedProducts));
};

export const addProduct = ({ name, type, defaultPrice, imageUrl }) => (
  dispatch,
  getState
) => {
  const db = firebase.firestore();
  const productInfo = {
    name,
    type,
    imageUrl,
    createdAt: new Date()
  };
  const companyId = selectors.data.getGroupInfo(getState()).id;
  const newProductRef = db.collection(appConstants.collection.PRODUCTS).doc();
  const newProductRefInParentSub = db
    .collection(appConstants.collection.GROUPS)
    .doc(companyId)
    .collection(appConstants.collection.PRODUCTS)
    .doc(newProductRef.id);
  return db
    .batch()
    .set(newProductRef, productInfo)
    .set(newProductRefInParentSub, {
      status: {
        available: true,
        price: { default: defaultPrice },
        off_percent: {
          default: 0
        }
      }
    })
    .commit();
};

export const acceptNewQuotation = quotationId => (dispatch, getState) => {
  const db = firebase.firestore();
  const batch = db.batch();
  const currentGroup = selectors.data.getGroupInfo(getState());
  const parentGroup = selectors.data.getParent(getState());
  const currentGroupDocRef = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id);
  const quotationRefInParent = db
    .collection(appConstants.collection.GROUPS)
    .doc(parentGroup.info.id)
    .collection(appConstants.collection.ORDERS)
    .doc(quotationId);
  const quotationRef = currentGroupDocRef
    .collection(appConstants.collection.QUOTATIONS)
    .doc(quotationId);
  const update = { status: { verified: "accepted" } };
  batch.update(quotationRef, update);
  batch.set(quotationRefInParent, { ...update, ...{ from: currentGroup.id } });
  return batch.commit();
};

export const rejectNewQuotation = quotationId => (dispatch, getState) => {
  const db = firebase.firestore();
  const batch = db.batch();
  const currentGroup = selectors.data.getGroupInfo(getState());
  const parentGroup = selectors.data.getParent(getState());
  const currentGroupDocRef = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id);
  const quotationRefInParent = db
    .collection(appConstants.collection.GROUPS)
    .doc(parentGroup.info.id)
    .collection(appConstants.collection.ORDERS)
    .doc(quotationId);
  const quotationRef = currentGroupDocRef
    .collection(appConstants.collection.QUOTATIONS)
    .doc(quotationId);
  const update = { status: { verified: "rejected" } };
  batch.update(quotationRef, update);
  batch.set(quotationRefInParent, { ...update, ...{ from: currentGroup.id } });
  return batch.commit();
};

export const acceptNewOrder = (fromId, orderId) => (dispatch, getState) => {
  const db = firebase.firestore();
  const batch = db.batch();
  const currentGroup = selectors.data.getGroupInfo(getState());
  const currentGroupDocRef = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id);
  const quotationRefInChild = db
    .collection(appConstants.collection.GROUPS)
    .doc(fromId)
    .collection(appConstants.collection.QUOTATIONS)
    .doc(orderId);
  const quotationRef = currentGroupDocRef
    .collection(appConstants.collection.ORDERS)
    .doc(orderId);
  const update = { status: { verified: "accepted" } };
  batch.update(quotationRef, update);
  batch.set(quotationRefInChild, { ...update });
  return batch.commit();
};

export const rejectNewOrder = (fromId, orderId) => (dispatch, getState) => {
  const db = firebase.firestore();
  const batch = db.batch();
  const currentGroup = selectors.data.getGroupInfo(getState());
  const currentGroupDocRef = db
    .collection(appConstants.collection.GROUPS)
    .doc(currentGroup.id);
  const quotationRefInChild = db
    .collection(appConstants.collection.GROUPS)
    .doc(fromId)
    .collection(appConstants.collection.ORDERS)
    .doc(orderId);
  const quotationRef = currentGroupDocRef
    .collection(appConstants.collection.QUOTATIONS)
    .doc(orderId);
  const update = { status: { verified: "rejected" } };
  batch.update(quotationRef, update);
  batch.set(quotationRefInChild, { ...update });
  return batch.commit();
};

export const makeCreateAgencyAccount = ({
  account,
  accountProfile,
  groupInfo,
  defaultOffPercent
}) => (dispatch, getState) => {
  const db = firebase.firestore();
  const createdAt = new Date();
  return firebase
    .auth()
    .createUserWithEmailAndPassword(account.email, account.password)
    .then(res => {
      const { user } = res;
      const currentGroup = selectors.data.getGroupInfo(getState());
      const currentGroupDocRef = db
        .collection(appConstants.collection.GROUPS)
        .doc(currentGroup.id);

      const newChildRef = db.collection(appConstants.collection.GROUPS).doc();
      const newChildData = {
        info: {
          ...groupInfo,
          ...{ id: newChildRef.id, parent_group_id: currentGroup.id }
        },
        createdAt
      };

      const childRefInCurrentGroup = currentGroupDocRef
        .collection(appConstants.collection.CHILDREN)
        .doc(newChildRef.id);
      const childDataInCurrentGroup = {
        status: {
          off_percent: { default: defaultOffPercent }
        },
        createdAt
      };

      const newAccountProfile = {
        ...accountProfile,
        group: {
          group_type: groupInfo.type,
          group_id: newChildRef.id
        },
        createdAt
      };
      const newAccountDocRef = db
        .collection(appConstants.collection.USERS)
        .doc(user.uid);

      return db
        .batch()
        .set(newAccountDocRef, newAccountProfile)
        .set(newChildRef, newChildData)
        .set(childRefInCurrentGroup, childDataInCurrentGroup)
        .commit()
        .then(() => newChildRef.id);
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
};

const getAppData = ({ group: { group_id, group_type } }) => dispatch => {
  // // console.log("getting app data");
  const groupDocRef = firebase
    .firestore()
    .collection(appConstants.collection.GROUPS)
    .doc(group_id);
  dispatch(getGroupAndRelatives(groupDocRef));
  dispatch(
    getCollectionAndMergeDetails(groupDocRef, appConstants.collection.PRODUCTS)
  );
  dispatch(
    getCollectionAndMergeDetails(
      groupDocRef,
      appConstants.collection.QUOTATIONS,
      appConstants.collection.ORDERS
    )
  );
  if (group_type !== appConstants.groupType.RETAIL) {
    dispatch(
      getCollectionAndMergeDetails(groupDocRef, appConstants.collection.ORDERS)
    );
  }
};

const getGroupAndRelatives = groupDocRef => dispatch => {
  // console.log("getting parent and children if needed");
  dispatch(getGroupAndParent(groupDocRef));
  dispatch(
    getCollectionAndMergeDetails(
      groupDocRef,
      appConstants.collection.CHILDREN,
      appConstants.collection.GROUPS
    )
  );
};

const getGroupAndParent = groupDocRef => dispatch => {
  dispatch(loadData({ endpoint: appConstants.dataEndpoint.GROUP_INFO }));
  groupDocRef
    .get()
    .then(async doc => {
      // // console.log("checking if group exist");
      if (doc.exists) {
        const { info: groupInfo } = doc.data();
        dispatch(
          receiveData({
            endpoint: appConstants.dataEndpoint.GROUP_INFO,
            data: groupInfo
          })
        );
        if (Platform.OS === "android") {
          subscribeToTopic(groupInfo);
        }

        // // console.log("checking if parent group exists");
        const { parent_group_id } = groupInfo;
        if (parent_group_id) {
          dispatch(loadData({ endpoint: appConstants.dataEndpoint.PARENT }));
          const { error, data: parentGroupDoc } = await promiseWrapper(
            firebase
              .firestore()
              .collection(appConstants.collection.GROUPS)
              .doc(parent_group_id)
              .get()
          );
          if (!error && parentGroupDoc.exists) {
            return dispatch(
              receiveData({
                endpoint: appConstants.dataEndpoint.PARENT,
                data: parentGroupDoc.data()
              })
            );
          }
          console.log(error);
        }
        dispatch(
          invalidateData({
            endpoint: appConstants.dataEndpoint.PARENT,
            message: "Không có dữ liệu"
          })
        );
      }
    })
    .catch(err =>
      dispatch(
        invalidateData({
          endpoint: appConstants.dataEndpoint.GROUP_INFO,
          message: err.message
        })
      )
    );
};

const getCollectionAndMergeDetails = (
  groupRef: DocumentReference,
  collectionName,
  parentCollectionName = collectionName
) => dispatch => {
  // // console.log("getting " + collectionName);
  return groupRef
    .collection(collectionName)
    .onSnapshot((query: QuerySnapshot) => {
      if (!query.empty) {
        dispatch(loadData({ endpoint: collectionName }));
        // console.log(collectionName + " not empty");
        let allIds = [],
          byId = {};
        dispatch(
          receiveData({ endpoint: collectionName, data: { allIds, byId } })
        );
        query.docs.forEach(async docSnapshot => {
          const { error, data: snapshot } = await promiseWrapper(
            firebase
              .firestore()
              .collection(parentCollectionName)
              .doc(docSnapshot.id)
              .get()
          );
          if (!error && snapshot.exists) {
            return dispatch(
              observeData({
                endpoint: collectionName,
                id: docSnapshot.id,
                data: {
                  ...docSnapshot.data(),
                  ...{ detail: snapshot.data() }
                }
              })
            );
          }
          // console.log(error);
        });
      }
    });
};

const loadData = ({ endpoint }) => {
  return {
    type: types.data.LOAD_DATA,
    meta: { endpoint }
  };
};

const invalidateData = ({ endpoint, message }) => {
  return {
    type: types.data.INVALIDATE_DATA,
    meta: { endpoint },
    payload: { message }
  };
};

const receiveData = ({ endpoint, data }) => {
  return {
    type: types.data.GET_DATA,
    meta: { endpoint },
    payload: { data }
  };
};

const observeData = ({ endpoint, id, data }) => {
  return {
    type: types.data.OBSERVE_DATA,
    meta: { endpoint },
    payload: { id, data }
  };
};

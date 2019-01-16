// @flow

// eslint-disable-next-line import/named
import { Platform } from "react-native";
import firebase from "react-native-firebase";
import appConstants from "~/appConstants";
import store from "~/configureStore";
import selectors from "~/Selectors";
import { promiseWrapper } from "~/Utils/utils";
import types from "./ActionTypes";
import { addProductsToAgencies, createOrder, createQuotation } from "./global";
import { setAppMode } from "./ui.actions";

import type { QuerySnapshot, DocumentReference } from "react-native-firebase";

// how to ignore warning /^(?!Require cycle).*$/

export const initAppData = ({ uid }) => async dispatch => {
  // // console.log("init app data");
  const { data: snapshot, error } = await promiseWrapper(
    firebase
      .firestore()
      .collection(appConstants.collection.USERS)
      .doc(uid)
      .get()
  );
  return new Promise((resolve, reject) => {
    if (!error && snapshot.exists) {
      const userProfile = snapshot.data();
      dispatch(
        receiveData({
          endpoint: appConstants.dataEndpoint.USER_PROFILE,
          data: { [uid]: userProfile }
        })
      );
      dispatch(setAppMode(userProfile));
      getAppData(userProfile).then(() => {
        resolve(subscribeToTopicIfNeeded(userProfile.group.group_id));
      });
    } else {
      reject("Không có dữ liệu");
    }
  });
};

export const subscribeToTopicIfNeeded = async groupId => {
  if (Platform.OS === "android") {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log("have token");
    }
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log(`subscribing to /topics/${groupId}`);
      firebase.messaging().subscribeToTopic(`/topics/${groupId}`);
    }
  }
};

export const makeAddProductsToAgencies = () => (dispatch, getState) => {
  const state = getState();
  const agencyIds = selectors.cart.getSelectedAgenciesInCart(
    state,
    appConstants.productItemContext.ADD_TO_AGENCY
  );
  const selectedProducts = selectors.cart.getProductsInCart(state, {
    endpoint: appConstants.productItemContext.ADD_TO_AGENCY
  });
  const data = agencyIds.reduce((obj, agencyId) => {
    obj[agencyId] = Object.keys(selectedProducts);
    return obj;
  }, {});
  console.log("after transform", data);
  return dispatch(addProductsToAgencies(data));
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
  return createOrder(parentId, selectedProducts);
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

const getAppData = ({ group: { group_id, group_type } }): Promise => {
  // // console.log("getting app data");
  const appDataPromises = [];
  const groupDocRef = firebase
    .firestore()
    .collection(appConstants.collection.GROUPS)
    .doc(group_id);
  appDataPromises.push(getGroupAndRelatives(groupDocRef));
  appDataPromises.push(
    getCollectionAndMergeDetails(groupDocRef, appConstants.collection.PRODUCTS)
  );
  appDataPromises.push(
    getCollectionAndMergeDetails(
      groupDocRef,
      appConstants.collection.QUOTATIONS,
      appConstants.collection.ORDERS
    )
  );
  if (group_type !== appConstants.groupType.RETAIL) {
    appDataPromises.push(
      getCollectionAndMergeDetails(groupDocRef, appConstants.collection.ORDERS)
    );
  }
  return Promise.all(appDataPromises);
};

const getGroupAndRelatives = (groupDocRef): Promise => {
  // console.log("getting parent and children if needed");
  return Promise.all([
    getGroupAndParent(groupDocRef),
    getCollectionAndMergeDetails(
      groupDocRef,
      appConstants.collection.CHILDREN,
      appConstants.collection.GROUPS
    )
  ]);
};

const getGroupAndParent = (groupDocRef): Promise => {
  const { dispatch } = store;
  dispatch(loadData({ endpoint: appConstants.dataEndpoint.GROUP_INFO }));
  return groupDocRef
    .get()
    .then(async doc => {
      if (doc.exists) {
        const { info: groupInfo } = doc.data();
        dispatch(
          receiveData({
            endpoint: appConstants.dataEndpoint.GROUP_INFO,
            data: groupInfo
          })
        );
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

const getCollectionAndMergeDetails = async (
  groupRef: DocumentReference,
  collectionName,
  parentCollectionName = collectionName
) => {
  const { dispatch } = store;
  return groupRef
    .collection(collectionName)
    .onSnapshot((query: QuerySnapshot) => {
      query.docChanges.forEach(async docChange => {
        const changeType = docChange.type;
        const docSnapshot = docChange.doc;
        const { data: detailSnapshot, error } = await promiseWrapper(
          firebase
            .firestore()
            .collection(parentCollectionName)
            .doc(docSnapshot.id)
            .get()
        );
        if (!error) {
          if (detailSnapshot.exists) {
            dispatch(
              observeData({
                endpoint: collectionName,
                id: docSnapshot.id,
                change: {
                  type: changeType,
                  data: {
                    ...docSnapshot.data(),
                    ...{ detail: detailSnapshot.data() }
                  }
                }
              })
            );
          }
        }
      });
    });
};

export const getAgencyProductsIfNeeded = agencyId => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if (!selectors.data.getProductsOfAgency(getState(), { id: agencyId })) {
      console.log("getting products of agency " + agencyId);
      dispatch(requestAgencyProducts({ agencyId }));
      return firebase
        .firestore()
        .collection(appConstants.collection.GROUPS)
        .doc(agencyId)
        .collection(appConstants.collection.PRODUCTS)
        .onSnapshot(query => {
          const productIds = query.docs.map(doc => doc.id);
          dispatch(
            observeAgencyProducts({
              agencyId,
              productIds
            })
          );
          console.log("before resolve");
          resolve(productIds);
          console.log("after resolve");
        });
    } else {
      console.log("getting products of agency " + agencyId);
      resolve("Đã có dữ liệu");
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

const observeData = ({ endpoint, id, change }) => {
  return {
    type: types.data.OBSERVE_DATA,
    meta: { endpoint },
    payload: { id, change }
  };
};

const observeDetail = ({ endpoint, id, detail }) => {
  return {
    type: types.data.OBSERVE_DETAIL,
    meta: { endpoint },
    payload: { id, detail }
  };
};

const requestAgencyProducts = ({ agencyId }) => {
  return {
    type: types.data.LOAD_AGENCY_PRODUCTS,
    payload: { agencyId }
  };
};

const observeAgencyProducts = ({ agencyId, productIds }) => {
  return {
    type: types.data.OBSERVE_AGENCY_PRODUCTS,
    payload: { agencyId, productIds }
  };
};

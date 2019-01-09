// eslint-disable-next-line import/named
import firebase from "react-native-firebase";

import appConstants from "~/appConstants";
import selectors from "~/Selectors";
import { promiseWrapper } from "~/Utils/utils";
import types from "./ActionTypes";
import { setAppMode } from "./ui.actions";
// how to ignore warning /^(?!Require cycle).*$/
// TODO add product type

export const initAppData = ({ uid }) => async dispatch => {
  console.log("init app data");
  const { data: snapshot, error } = await promiseWrapper(
    firebase
      .firestore()
      .collection(appConstants.collection.USERS)
      .doc(uid)
      .get()
  );
  if (!error && snapshot.exists) {
    const userProfile = snapshot.data();
    console.log("userProfile exist");
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

export const addProduct = ({ name, type, defaultPrice }) => (
  dispatch,
  getState
) => {
  const db = firebase.firestore();
  const productInfo = {
    name,
    type,
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
          ...{ parent_group_id: currentGroup.id }
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
        .commit();
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
};

const getAppData = ({ group: { group_id, group_type } }) => dispatch => {
  console.log("getting app data");
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
      appConstants.collection.QUOTATIONS
    )
  );
  if (group_type !== appConstants.groupType.RETAIL) {
    dispatch(
      getCollectionAndMergeDetails(groupDocRef, appConstants.collection.ORDERS)
    );
  }
};

const getGroupAndRelatives = groupDocRef => dispatch => {
  console.log("getting parent and children if needed");
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
  groupDocRef.get().then(async doc => {
    console.log("checking if group exist");
    if (doc.exists) {
      const { info: groupInfo } = doc.data();
      dispatch(receiveData({ endpoint: "groupInfo", data: groupInfo }));
      console.log("checking if parent group exists");
      const { parent_group_id } = groupInfo;
      if (parent_group_id) {
        const { error, data: parentGroupDoc } = await promiseWrapper(
          firebase
            .firestore()
            .collection(appConstants.collection.GROUPS)
            .doc(parent_group_id)
            .get()
        );
        if (!error && parentGroupDoc.exists) {
          return dispatch(
            receiveData({ endpoint: "parent", data: parentGroupDoc.data() })
          );
        }
        console.log(error);
      }
    }
  });
};

const getCollectionAndMergeDetails = (
  groupRef,
  collectionName,
  parentCollectionName = collectionName
) => dispatch => {
  console.log("getting " + collectionName);
  groupRef.collection(collectionName).onSnapshot(query => {
    if (!query.empty) {
      console.log(collectionName + " not empty");
      let allIds = [],
        byId = {};
      query.docs.forEach(async docSnapshot => {
        const { error, data: snapshot } = await promiseWrapper(
          firebase
            .firestore()
            .collection(parentCollectionName)
            .doc(docSnapshot.id)
            .get()
        );
        if (!error && snapshot.exists) {
          allIds.push(docSnapshot.id);
          byId[docSnapshot.id] = {
            ...docSnapshot.data(),
            ...{ detail: snapshot.data() }
          };
          return;
        }
        console.log(error);
      });
      return dispatch(
        receiveData({ endpoint: collectionName, data: { allIds, byId } })
      );
    }
  });
};

const receiveData = ({ endpoint, data }) => {
  return {
    type: types.data.GET_DATA,
    meta: { endpoint },
    payload: { data }
  };
};

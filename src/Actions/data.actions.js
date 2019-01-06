// eslint-disable-next-line import/named
import firebase, { DocumentReference } from "react-native-firebase";
import appConstants from "~/appConstants";
import { promiseWrapper } from "~/Utils/utils";
import types from "./ActionTypes";
import { setAppMode } from "./ui.actions";
import selectors from "~/Selectors";

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

export const makeCreateAgencyAccount = ({
  account,
  accountProfile,
  groupInfo,
  defaultOffPercent
}) => (dispatch, getState) => {
  const db = firebase.firestore();
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
          ...{ parent_group_type: currentGroup.id }
        }
      };

      const childRefInCurrentGroup = currentGroupDocRef
        .collection(appConstants.collection.CHILDREN)
        .doc(newChildRef.id);
      const childDataInCurrentGroup = {
        status: {
          off_percent: { default: defaultOffPercent }
        }
      };

      const newAccountProfile = {
        ...accountProfile,
        group: {
          group_type: groupInfo.type,
          group_id: newChildRef.id
        }
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

const getGroupAndRelatives = (groupDocRef: DocumentReference) => dispatch => {
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

const getGroupAndParent = (groupDocRef: DocumentReference) => dispatch => {
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
  groupRef: DocumentReference,
  collectionName: string,
  parentCollectionName: string = collectionName
) => dispatch => {
  console.log("getting " + collectionName);
  groupRef
    .collection(collectionName)
    // .orderBy("createdAt", "ASC")
    .onSnapshot(query => {
      if (!query.empty) {
        console.log(collectionName + " not empty");
        let allIds = [];
        let byId = {};
        query.docs.forEach(async docRef => {
          allIds.push(docRef.id);
          const { error, data: snapshot } = await promiseWrapper(
            firebase
              .firestore()
              .collection(parentCollectionName)
              .doc(docRef.id)
              .get()
          );
          if (!error && snapshot.exists) {
            byId[docRef.id] = {
              ...docRef.data(),
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

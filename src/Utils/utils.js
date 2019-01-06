import appConstants from "~/appConstants";
import ValidateJs from "validate.js";
import firebase from "react-native-firebase";

export const promiseWrapper = promise =>
  promise
    .then(data => ({ data, error: null }))
    .catch(error => ({ error, data: null }));

const asyncCheckIfRegistered = email => {
  return new ValidateJs.Promise((resolve, reject) => {
    firebase
      .firestore()
      .collection(appConstants.collection.USERS)
      .where("email", "==", email)
      .get()
      .then(query => {
        if (query.empty) return resolve();
        return resolve("Đã tồn tại");
      });
  });
};

export const validateFields = (fields, constrants) =>
  ValidateJs.validate(fields, constrants);

export const validateFieldsWithCheckEmailExistenceAsync = (
  fields,
  constrants
) => {
  ValidateJs.validators.emailExists = asyncCheckIfRegistered;
  return ValidateJs.async(fields, constrants);
};

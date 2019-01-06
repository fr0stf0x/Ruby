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

export const randomImage = () => {
  return [
    require("~/assets/img/products/coca_01.jpg"),
    require("~/assets/img/products/coca_02.jpg")
  ][Math.floor(Math.random() * 2)];
};

export const randomImageAgency = () => {
  return [
    require("~/assets/img/agencies/ag_01.jpg"),
    require("~/assets/img/agencies/ag_02.jpg"),
    require("~/assets/img/agencies/ag_03.jpg")
  ][Math.floor(Math.random() * 3)];
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

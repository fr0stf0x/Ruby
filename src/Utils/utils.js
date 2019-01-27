import appConstants from "~/appConstants";
import ValidateJs from "validate.js";
import firebase from "react-native-firebase";
import { Linking } from "react-native";

export const promiseWrapper = promise =>
  promise
    .then(data => ({ data, error: null }))
    .catch(error => ({ error, data: null }));

export const formatMoney = money =>
  (money === 0 && "FREE") ||
  (+money / 1000).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") + " K";

export const formatDate = (date: Date): String => {
  var monthNames = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + ", " + year;
};

export const formatDateTimeForFileName = (date: Date): String => {
  var monthNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var second = date.getSeconds();
  return (
    year +
    "_" +
    monthNames[monthIndex] +
    "_" +
    day +
    "__" +
    (hour < 10 ? "0" + hour : hour) +
    "_" +
    (minutes < 10 ? "0" + minutes : minutes) +
    "_" +
    (second < 10 ? "0" + second : second)
  );
};

export const formatTime = (date: Date): String => {
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var second = date.getSeconds();
  return (
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (second < 10 ? "0" + second : second)
  );
};

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

export const randomProductImage = () => {
  return [
    require("~/assets/img/products/coca_01.jpg"),
    require("~/assets/img/products/coca_02.jpg"),
    require("~/assets/img/products/coca_03.jpg"),
    require("~/assets/img/products/coca_04.jpg")
  ][Math.floor(Math.random() * 4)];
};

export const randomAgencyImage = () => {
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

export const makeCall = phone => {
  const url = `tel:${phone}`;
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      return Linking.openURL(url).catch(() => null);
    }
  });
};

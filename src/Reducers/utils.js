export const mergeObj = (target, ...sources) => {
  return Object.assign({}, target, ...sources);
};

export const mergeItemInArray = ({ array, idKey = "id", itemId, callback }) => {
  return array.map(item => {
    if (item[idKey] !== itemId) {
      return item;
    }
    return callback(item);
  });
};

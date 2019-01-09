export const mergeObj = (target, ...sources) => {
  return Object.assign({}, target, ...sources);
};

export const mergeItemInArray = (array, itemId, callback) => {
  return array.map(item => {
    if (item.id !== itemId) {
      return item;
    }
    return callback(item);
  });
};

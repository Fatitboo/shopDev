const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ['a','b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a','b'] = {a: 0, b: 0}
const getUnSelectData = (unselect = []) => {
  return Object.fromEntries(unselect.map((el) => [el, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key] === "object")
      removeUndefinedObject(object[key]);
    else if (object[key] == null) delete object[key];
  });
  return object;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const convertToObjectIdMongodb = (id) => Types.ObjectId(id);
module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};

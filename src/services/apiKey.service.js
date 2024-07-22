"use-strict";
const apiKeyModel = require("../models/apiKey.model");

const findById = async (id) => {
  return await apiKeyModel.findOne({ key: id }).lean();
};

module.exports = { findById };

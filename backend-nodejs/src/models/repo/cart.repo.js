"use strict";
const { getUnSelectData, getSelectData } = require("../../utils");
const cartModel = require("../cart.model");

const findCartById = async (cartId) => {
  return await cartModel.findOne({ _id: cartId, cart_status: "active" }).lean();
};
module.exports = {
  findCartById,
};

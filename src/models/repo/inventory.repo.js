"use strict";

const { Types } = require("mongoose");
const inventory = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopid,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopid,
  });
};

module.exports = { insertInventory };

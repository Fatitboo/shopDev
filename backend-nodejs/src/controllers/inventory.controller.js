"use strict";

const { SuccessResponse } = require("../core/success.response");
const inventoryServices = require("../services/inventory.service");

class InventoryController {
  // POST //
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "add stock to inventory success!",
      metadata: await inventoryServices.addStockToInventory(req.body),
    }).send(res);
  };

}

module.exports = new InventoryController();

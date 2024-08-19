"use strict";

const { OK, SuccessResponse } = require("../core/success.response");
const DiscountServices = require("../services/discount.service");

class DiscountController {
  // POST //
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code Generations",
      metadata: await DiscountServices.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "get All Discount Codes success!",
      metadata: await DiscountServices.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "get Discount Amount success!",
      metadata: await DiscountServices.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "get Al lDiscountCodes With Product success!",
      metadata: await DiscountServices.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
  // END POST
}

module.exports = new DiscountController();

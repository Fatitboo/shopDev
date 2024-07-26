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
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "get Al lDiscountCodes With Product success!",
      metadata: await DiscountServices.getAllDiscountCodesWithProduct({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  // END POST

  // QUERY
  /**
   * @desc Get all Drafts for shop
   * @param {Number } limit
   * @param {Number } skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft product success!",
      metadata: await DiscountServices.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list published product success!",
      metadata: await DiscountServices.findAllPublishedForShop({
       product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search product success!",
      metadata: await DiscountServices.searchProduct(req.params.keySearch),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "find All Products success!",
      metadata: await DiscountServices.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get detail Product success!",
      metadata: await DiscountServices.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY
}

module.exports = new DiscountController();

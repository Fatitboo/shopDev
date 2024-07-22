"use strict";

const { OK, SuccessResponse } = require("../core/success.response");
const ProductServices = require("../services/product.service");
const ProductServicesV2 = require("../services/product.service.v2");

class ProductController {
  // POST //
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new product success!",
      metadata: await ProductServicesV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "update new product success!",
      metadata: await ProductServicesV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success!",
      metadata: await ProductServicesV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish product success!",
      metadata: await ProductServicesV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
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
      metadata: await ProductServicesV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list published product success!",
      metadata: await ProductServicesV2.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search product success!",
      metadata: await ProductServicesV2.searchProduct(req.params.keySearch),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "find All Products success!",
      metadata: await ProductServicesV2.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get detail Product success!",
      metadata: await ProductServicesV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY
}

module.exports = new ProductController();

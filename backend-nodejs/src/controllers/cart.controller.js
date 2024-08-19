"use strict";

const { OK, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  /**
   * add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url
   * @return {
   * }
   */
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart success!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update to cart success!",
      metadata: await CartService.addToCartV2({...req.body}),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "delete to cart success!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "List to cart success!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();

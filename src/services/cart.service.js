"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const { getProductById } = require("../models/repo/product.repo");

/*
  Key features: Cart service
  - add product  to cart (user)
  - reduce product quantity by one [user]
  - increase product quantity by one [user]
  - get cart
  - delete cart
  - delete cart item

*/
class CartService {
  static async createCartUser({ userId, product = {} }) {
    const query = { cart_userId: userId, cart_status: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { new: true, upsert: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        cart_status: "active",
        "cart_products.productId": productId,
      },
      updateOrInsert = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { new: true, upsert: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await this.createCartUser({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await this.updateUserCartQuantity({ userId, product });
  }
  /*
    shop_order_ids:[
      {
        shopId, 
        item_products:[
          {
            quantity, price, shopId, old_quantity:, productId
          }
        ]
      version
      }
    ]
    */
  static async addToCartV2({ userId, shop_order_ids }) {
    console.log(shop_order_ids)
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Not found product");
    // compare
    if (foundProduct.product_shop.toString() != shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop");

    if (quantity === 0) {
      this.deleteUserCart({ userId, productId });
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_status: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    return await cart.updateOne(query, updateSet);
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;

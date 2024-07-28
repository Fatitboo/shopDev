"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repo/discount.repo");
const { findAllProducts } = require("../models/repo/product.repo");

/*
  Discount Services
  1 - Generator Discount Code [Shop | Admin]
  2 - Get discount amount (User]
  3 - Get all discount codes [User | Shop]
  4ー Verify discount code [user]
  5 - Delete discount Code [Admin | Shop]
  6 - Cancel discount code [usre]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // kiem tra
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Discount code has expried!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end _date");
    }

    // create index for discount code
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /*
    Get all discount codes available with products
  */
  static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
    console.log("🚀 ~ DiscountService ~ page:", code, shopId, limit, page);

    // create index for discount_code
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exists!");
    }

    let products;
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        linit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    console.log(
      "🚀 ~ DiscountService ~ getAllDiscountCodesWithProduct ~ discount_product_ids:",
      discount_product_ids
    );
    if (discount_applies_to === "specific") {
      // get the products ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        linit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  /*
    Apply Discount Code
    products = [
      { productid, shopId, quantity, name, price },
      { productid, shopid, quantity, name, price },
    ]; 
  */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
    });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exists!");
    }
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_max_uses_per_user,
      discount_end_date,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("discount expried!");
    if (!discount_max_uses) throw new NotFoundError("discount are out!");

    if (new Date() > new Date(discount_end_date))
      throw new NotFoundError("discount ecode has expried!");

    // check xem co set min val gia tri toi thieu hay khong?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount requires a minium order value of ${discount_min_order_value}!`
        );
      }

      if (discount_max_uses_per_user > 0) {
        const userUsedDiscount = discount_users_used.find(
          (user) => user.userId == userId
        );
      }
    }
    // check xem discount nay la fixed_amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return { totalOrder, discount: amount, totalPrice: totalOrder - amount };
  }

  static async deleteDiscountCode({ code, shopId }) {
    return await discount.findOneAndDelete({
      discount_code: code,
      discount_shopId: shopId,
    });
  }

  // cancel discount code
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exists!");
    }
    return await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = DiscountService;

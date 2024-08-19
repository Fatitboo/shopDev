"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/repo/cart.repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repo/discount.repo");
const {
  findAllProducts,
  checkoutProductByServer,
} = require("../models/repo/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

/*
  Checkout Services
  1 -
*/

class CheckoutService {
  /*
    cartId, 
    userId,
    shop_order_ids:[
      {
        shopId, 
        item_products:[
          {
            shopId,
            shop_discount:[
              {
                discountId,
                shopId, 
                codeId
              }
            ],
            item_products:[
              {
                 price, 
                 quantity,
                 productId
              }
            ]
          }
        ]
      version
      }
    ]
    */
  static async checkoutReview({ userId, cartId, shop_order_ids }) {
    // check cart id
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("cart does not exist!");

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien discount giam gia
        totalCheckout: 0, // thong thanh toan
      },
      shop_order_ids_new = [];

    for (let index = 0; index < shop_order_ids.length; index++) {
      const {
        shopId,
        item_products = [],
        shop_discounts = [],
      } = shop_order_ids[index];

      //check product available
      const checkProductServer = await checkoutProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError("order wrong!!!");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
    
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tine truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        checkout_order.totalDiscount += discount;
        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }


  // order
  static async orderByUser({shop_order_ids, cartId, userId, user_address={}, user_payment={}}){
    const {shop_order_ids_new, checkout_order} = await this.checkoutReview({
      userId,
      cartId,
      shop_order_ids
    })

    // check lai xem co vuot ton kho hay khong
    // get new array products
    const products  = shop_order_ids_new .flatMap(order=> order.item_products)
    console.log(`[1]::`, products)
    const acquireProduct = []
    for (let index = 0; index < products.length; index++) {
      const {productId, quantity} = products[index];

      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push(keyLock ? true : false)
      if(keyLock){
        await releaseLock(keyLock)
      }
      
      // check if co mot san pham het hang trong kho
      if(acquireProduct.includes(false)){
        throw new BadRequestError("Mot so san pham da duoc cap nhat, vui long quay lai gio hang ...")
      }

      const newOrder = await orderModel.create({
        order_userId: userId,
        order_checkout: checkout_order,
        order_shipping: user_address,
        order_payment: user_payment,
        order_products: shop_order_ids_new
      })

      // case: if insert success, remove product in cart
      if(newOrder){
        // remove product in my cart

      }

      return newOrder
    }

   

  }
   // query orders [users]
   static async getOrdersByUser(){
      
   }

  // query order using id [users]
  static async getOneOrderByUser(){
        
  }

  // cancel orders [users]
  static async cancelOrderByUser(){
        
  }

  // update order status [shop|Admin]
  static async updateOrderStatusByShop(){
        
  }


}

module.exports = CheckoutService;

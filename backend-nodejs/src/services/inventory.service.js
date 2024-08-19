"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const inventoryModel = require("../models/inventory.model");
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
class InventoryService {
  static async addStockToInventory({stock, productId, shopId, location='134, Tran Phu, Ho Chi Minh City'}){
    const product = await getProductById(productId)
    if(!product) throw new BadRequestError('the product doest not exists')
    const query ={inven_shopId: shopId, inven_productId: productId},
  updateSet={
    $inc:{
      inven_stock: stock
    }, 
    $set:{
      inven_location: location
    }
  }, options = {upsert: true, new: true}
  return await inventoryModel.findOneAndUpdate(query, updateSet, options)
  }
}

module.exports = InventoryService;

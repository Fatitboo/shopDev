"use strict";

// !mdbgum
const { Schema, Types, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    cart_status: {
      type: String,
      enum: ["active", "inactive", "pending", "failed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    /*
    [
      {
        productId,
        shopId,
        quantity,
        name,
        price
      }
    ]
    */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdon",
      updatedAt: "modifiedon",
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);

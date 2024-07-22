"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/search/:keySearch", asyncHandler(productController.getListSearchProduct));
router.post("", asyncHandler(productController.findAllProducts));
router.post("/:product_id", asyncHandler(productController.findProduct));

// authentication //
router.use(authentication);

// ---------------- //
router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProductByShop));


router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishedForShop));

module.exports = router;

"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);

router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.delete));
router.post("/updateCart", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.listToCart));


module.exports = router;

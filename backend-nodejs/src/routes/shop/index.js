"use strict";

const express = require("express");
const shopModel = require("../../models/shop.model");
const keyTokenModel = require("../../models/keyToken.model");

const router = express.Router();

router.get("/shop/all", async (req, res, next) => {
  await keyTokenModel.deleteMany({ refreshToken: [] });
  await shopModel.deleteMany({ name: 'Shop TIPS' });

  return res.status(200).json(await keyTokenModel.find({}));
});

module.exports = router;

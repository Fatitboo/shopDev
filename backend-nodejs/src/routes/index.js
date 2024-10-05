"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const { pushLogToDiscord } = require("../middlewares");

const router = express.Router();

router.use(pushLogToDiscord);
// check apikey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api", require("./access"));
//router.use("/v1/api", require("./shop"));

module.exports = router;

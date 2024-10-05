"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

// ---------------- //
router.post("/product-img", asyncHandler(uploadController.uploadProductImg));
router.post(
  "/product-img/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadProductImgThumb)
);
router.post(
  "/product-img/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadController.uploadProductImgsFromLocalFiles)
);
router.post(
  "/product-img/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadProductImgThumbS3)
);
module.exports = router;

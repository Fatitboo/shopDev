"use strict";

const { BadRequestError } = require("../core/error.response");
const { OK, SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  // POST //
  uploadProductImg = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload new product image success!",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };
  uploadProductImgThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload new product image success!",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
  uploadProductImgsFromLocalFiles = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload new product image success!",
      metadata: await UploadService.uploadImageFromLocal({
        path: files,
      }),
    }).send(res);
  };

  // S3Client
  uploadProductImgThumbS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload new product image success!",
      metadata: await UploadService.uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();

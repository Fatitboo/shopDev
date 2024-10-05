"use strict";
const {
  S3Client,
  PutObjectCommand,
  DeleteBucketCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_ACCESS_KEY_SECRET,
  },
};
const s3 = new S3Client(s3config);

module.exports = {
  s3,
  PutObjectCommand,
  DeleteBucketCommand,
  GetObjectCommand,
};

"use trict";

const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} = require("../configs/s3.config");
const crypto = require("crypto");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const urlImagesPublic = "https://dpntbw049rov9.cloudfront.net";
class UploadService {
  // 1. upload from  image with S3Client
  static async uploadImageFromLocalS3({ file }) {
    try {
      const randomImageName = () => crypto.randomBytes(16).toString("hex");
      const imgName = randomImageName();
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imgName,
        Body: file.buffer,
        ContentType: "image/jpeg", // that is what you need
      });

      await s3.send(command);

      // const signedUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: imgName,
      // });
      // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

      const url = getSignedUrl({
        url: `${urlImagesPublic}/${imgName}`,
        keyPairId: "K3HK2AHYTWO5ID",
        dateLessThan: new Date(Date.now() + 1000 * 60),
        privateKey: process.send.AWS_BUCKET_PUBLIC_KEY_ID,
      });

      return {
        url,
        result,
      };
    } catch (error) {
      console.error("Error uploading image::", error);
    }
  }

  // 2. upload from url image with Cloudinary
  static async uploadImageFromUrl() {
    try {
      const urlImage =
        "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgurcl7xiwab80";
      const folderName = "shopDEV/product/shopId",
        newFileName = "testdemo";
      const result = await cloudinary.uploader.upload(urlImage, {
        folder: folderName,
      });
      console.log("🚀 ~ uploadImageFromUrl ~ result:", result);
      return result;
    } catch (error) {
      console.error("Error uploading image::", error);
    }
  }
  static async uploadImageFromLocal({
    path,
    folderName = "shopDEV/product/8049",
  }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: "thumb",
        folder: folderName,
      });
      console.log("🚀 ~ uploadImageFromUrl ~ result:", result);
      return {
        image_url: result.secure_url,
        shopId: 8049,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      };
    } catch (error) {
      console.error("Error uploading image::", error);
    }
  }
  static async uploadImageFromLocalFiles({
    files,
    folderName = "shopDEV/product/8049",
  }) {
    console.log("🚀 ~ UploadService ~ files:", files, folderName);
    try {
      if (!files.length) return;
      const uploadUrls = [];
      for (const file in files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: folderName,
        });

        uploadUrls.push({
          image_url: result.secure_url,
          shopId: 8049,
          thumb_url: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            format: "jpg",
          }),
        });
      }
      return uploadUrls;
    } catch (error) {
      console.error("Error uploading image::", error);
    }
  }
}
module.exports = UploadService;

"use strict";

const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verfifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const ROLESHOP = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessServices {
  static login = async ({ email, password, refreshToken = null }) => {
    /*
      1 - check email in dbs
      2 - match password
      3 - create AT vs RT and save
      4 - generate tokens
      5 - get data return login
      */
    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    const match = brypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    //3. created privateKey, publickey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    //4 - generate tokens
    const tokens = await createTokenPair(
      { userId: userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // stepl: check email exists??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      roles: [ROLESHOP.SHOP],
      password: passwordHash,
    });

    if (newShop) {
      // crypto lib rsa

      // const { privateKey, publicKey } = crypto.generateKeyPairSysn("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      // default crypto of node
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });

      const keyStores = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStores) {
        throw new BadRequestError("Error: key Stores error!");
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log("Created Token Success::", tokens);

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    return null;
  };

  static logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrng happend !! Pls relogin");
    }

    const holderToken = await KeyTokenService.findByRefreshToken({
      refreshToken,
    });
    if (!holderToken) throw new AuthFailureError(" Shop not registeted");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]----", { userId, email });

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError(" Shop not registeted");

    const tokens = await createTokenPair(
      { userid, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessServices;

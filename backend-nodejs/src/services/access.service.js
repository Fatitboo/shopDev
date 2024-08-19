"use strict";

const bcrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
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
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    //3. created privateKey, publickey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    //4 - generate tokens
    const tokens = await createTokenPair(
      { userId, email },
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
        fields: ["_id", "name", "email"],
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

  static logout = async (keyStore) => {
    console.log(keyStore);
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend !! Pls relogin");
    }

    if (keyStore.refreshToken != refreshToken)
      throw new AuthFailureError(" Shop not registeted");

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError(" Shop not registeted 2");

    const tokens = await createTokenPair(
      { userid, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessServices;

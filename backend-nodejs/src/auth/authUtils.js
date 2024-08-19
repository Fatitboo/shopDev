"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });
    console.log({ accessToken, refreshToken });
    await JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1 - Check userld missing???
  2 - get accessToken
  3 - verifyToken
  4 - check user in bds?
  5 - check keyStore with this userid?
  6 -OK all => return next()
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError(" Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshtoken = refreshtoken;
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = await verifyJWT(accessToken, keyStore.publicKey);
    console.log(decodeUser);

    if (userId != decodeUser?.userId)
      throw new AuthFailureError("Invalid Request");

    req.user = decodeUser;
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret, (err, decode) => {
    if (err) {
      console.error("error verify::", err);
      return err;
    } else {
      console.log("decode verify::", decode);
      return decode;
    }
  });
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};

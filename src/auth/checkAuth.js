"use strict";


const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check objKey exist
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    console.log(req.objKey);

    if (!req.objKey.permissons) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    const validPermisson = req.objKey.permissons.includes(permission);
    if (!validPermisson) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};

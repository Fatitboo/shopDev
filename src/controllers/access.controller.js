"use strict";

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const AccessServices = require("../services/access.service");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login success!",
      metadata: await AccessServices.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Regiserted OK!",
      metadata: await AccessServices.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessServices.logout(req.keyStore),
    }).send(res);
  };

  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessServices.handlerRefreshToken({
        keyStore: req.keyStore,
        refreshToken: req.refreshToken,
        user: req.user,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();

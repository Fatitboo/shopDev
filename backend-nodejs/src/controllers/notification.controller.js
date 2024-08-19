"use strict";

const { OK, SuccessResponse } = require("../core/success.response");
const notificationServices = require("../services/notification.service");

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "get All notification success!",
      metadata: await notificationServices.listNotiByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();

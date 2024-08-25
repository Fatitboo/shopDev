"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error consumerToQueue::", error);
    }
  },

  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess"; // assertQueue

      // expiration
      //   const timeExpried = 15000;
      //   setTimeout(() => {
      //     channel.consume(notiQueue, (msg) => {
      //       console.log(
      //         "SEND notificationQueue sucessfully processed:*",
      //         msg.content.toString()
      //       );
      //       channel.ack(msg);
      //     });
      //   }, timeExpried);

      // wrong logic
      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });
          if (numberTest < 0.3) {
            throw new Error("Send notification failed:: HOT FIX");
          }
          console.log(
            "*SEND notificationQueue sucessfully processed:*",
            msg.content.toString()
          );
          channel.ack(msg);
        } catch (error) {
          //   console.error("SEND notification error:", error);
          channel.nack(msg, false, false);
          /**
           * nack: negative acknowledgement
           * arg 2: co gui lai khong. true ? gui lai : khong
           * arg 3: gui moi msg nay thoi
           */
        }
      });
    } catch (error) {
      console.error("Error consumerToQueue::", error);
    }
  },

  // case fail
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notificationExDLX"; // notificationDLX direct
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // assert
      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      channel.consume(
        notiQueueHandler,
        (msgFailed) => {
          console.log(
            "this notificaton error:, pls hot fix::*",
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error("Error consumerToQueue::", error);
    }
  },
};
module.exports = messageService;

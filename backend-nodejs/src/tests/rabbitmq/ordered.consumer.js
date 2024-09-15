"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:12345@localhost");
  const channel = await connection.createChannel();
  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // set prefetch to 1 to ensure only one ack at a time
  channel.prefetch(1);

  // consume
  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();
    setTimeout(() => {
      console.log("🚀 ~ channel.consume ~ message:", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((err) => {
  console.log("🚀 ~ err:", err);
});

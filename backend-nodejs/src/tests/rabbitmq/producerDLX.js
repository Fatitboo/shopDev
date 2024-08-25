const amqp = require("amqplib");
const messages = "new a product: Title abcassd";
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx"; // notification direct
    const notiQueue = "notificationQueueProcess"; // assertQueue
    const notificationExchangeDLX = "notificationExDLX"; // notificationDLX direct
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // assert

    // 1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phep cac ket noi khac truy cap vao cung mot luc hang doi
      deadLetterExchange: notificationExchangeDLX, // if 1 msg het han or err => send to DLX voi khoa dinh tuyen
      deadLetterRoutingKey: notificationRoutingKeyDLX, // khoa dinh tuyen duoc chi dinh => chuan nhat
    });

    // 3. binding queue
    // => dinh tuyen noti queue => notiEx
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. send a noti
    const msg = "a new product";
    console.log(`producer msg::*`, msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("error::", error);
  }
};
runProducer()
  .then((rs) => console.log(rs))
  .catch(console.error);

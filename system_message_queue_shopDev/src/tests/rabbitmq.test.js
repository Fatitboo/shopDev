"use strict";

const { connectToRabbitMQForTest } = require("../dbs/init.rabbit");

describe("RabbitMO Connection", () => {
  it("should connect to successful RabbitMQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});

"use strict";
const mongoose = require("mongoose");
const { before, after } = require("node:test");

const connectString = "mongodb://localhost:27017/shopDEV";

const TestSchema = new mongoose.Schema({ name: String });

const Test = mongoose.model("Test", TestSchema);

describe("Mongoose Connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect to mongodb", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = new Test({ name: "Anonystick" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should find a document in the database", async () => {
    const user = await Test.findOne({ name: "Anonystick" });
    expect(user).toBeDefined();
    expect(user.name).toBe("Anonystick");
  });
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("transactionLine Integration Tests", () => {
  let token;
  let createdId;

  beforeAll(() => {
    jest.spyOn(logger, 'warn').mockImplementation(() => { });
    jest.spyOn(logger, 'info').mockImplementation(() => { });
    token = jwt.sign(
      { _id: "serviceName" },
      process.env.TOKEN_KEY || "test_secret",
      { expiresIn: "1h" }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await closeRedisConnection();
    await CloseConnection();
    logger.warn.mockRestore();
    logger.info.mockRestore();
  });

  it("should create a new transactionLine", async () => {
    const res = await request(app)
      .post("/transactionLines")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        product: "1a65e081d37c2a9cace42208",
        quantity: 452,
        price: 810,
        currency: "3fee08eb38a989374938e827",
        transaction: "1e9ae61ef2763abf7e765ed0",
        inventoryMovement: ["f56c7d8b027b1559fd84131b"],
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of transactionLines", async () => {
    const res = await request(app)
      .get("/transactionLines")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get transactionLine by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/transactionLines/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update transactionLine", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/transactionLines/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete transactionLine", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/transactionLines/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

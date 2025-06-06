const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("inventory Integration Tests", () => {
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

  it("should create a new inventory", async () => {
    const res = await request(app)
      .post("/inventories")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        product: "15d36957e6f6b9fb3c084368",
        type: "code_18416",
        raison: "AaI00kDK",
        date: new Date("2025-05-12T18:03:41.387Z"),
        quantity: 262,
        price: 510,
        transactionLine: "68648e015feee0694d11ca4f",
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of inventories", async () => {
    const res = await request(app)
      .get("/inventories")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get inventory by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/inventories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update inventory", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/inventories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete inventory", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/inventories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

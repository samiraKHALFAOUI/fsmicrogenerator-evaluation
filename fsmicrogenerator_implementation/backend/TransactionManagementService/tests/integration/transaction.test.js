const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("transaction Integration Tests", () => {
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

  it("should create a new transaction", async () => {
    const res = await request(app)
      .post("/transactions")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        reference: "wuo71SOi",
        type: "code_18440",
        registrationDate: new Date("2025-05-13T00:32:26.798Z"),
        status: "code_1166",
        savedBy: "19656dd7fa27e0396667a38d",
        transactionLines: ["abc4b31882fb7ab283996c3d"],
        supplier: "bae5d25cf2c39d9935d29ec4",
        customer: "71261882dd075dbd63d8aaef",
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of transactions", async () => {
    const res = await request(app)
      .get("/transactions")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get transaction by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/transactions/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update transaction", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/transactions/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete transaction", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/transactions/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

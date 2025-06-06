const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');
const path = require("path");
const fs = require("fs");

describe("customer Integration Tests", () => {
  let token;
  let createdId;
  let file = null

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
    if (file)
      fs.rmSync(path.resolve(__dirname, `../../${file}`), { force: true })
  });

  it("should create a new customer", async () => {
    const res = await request(app)
      .post("/customers")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .field(
        "translations",
        '{"language":"en","name":"44cORyuS","address":"lsEyxSFi"}'
      )
      .field("email", "XJRW3tFO")
      .field("phoneNumber", "kszfh76j")
      .field("orders", '["1deabeee6469287fe89e1904"]')
      .attach("photo", path.resolve(__dirname, "../assets/fake-image.png"))
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
    file = res.body.photo;
  });

  it("should get list of customers", async () => {
    const res = await request(app)
      .get("/customers")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get customer by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/customers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update customer", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/customers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete customer", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/customers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

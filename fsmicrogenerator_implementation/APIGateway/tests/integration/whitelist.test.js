const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const logger = require('../../middlewares/winston.middleware')

describe("whitelist Integration Tests", () => {
  let token;
  const item = {
    type: "ip",
    key: "127.0.0.1",
    rateLimit: {
      window: 600,
      limit: 1000
    }
  };

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
    logger.warn.mockRestore();
    logger.info.mockRestore();
  });

  it("should register new item in whitelist", async () => {
    const res = await request(app)
      .post("/whitelists")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send(item)
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    item._id = res.body._id;
    if (!item._id) {
      console.warn("POST failed, skipping dependent tests");
      return;
    }
  });

  it("should get list of item registred in the whitelist", async () => {
    const res = await request(app)
      .get("/whitelists")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get item by type and key", async () => {
    const res = await request(app)
      .get(`/whitelists/${item.type}/${item.key}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", item._id);
  });

  it("should update rateLimit of given item", async () => {
    const res = await request(app)
      .patch(`/whitelists/${item.type}/${item.key}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        rateLimit: {
          window: 650,
          limit: 1050
        }
      })
      .expect(200);
    expect(res.body).toHaveProperty("_id", item._id);
  });

  it("should delete item from the whitelist", async () => {
    await request(app)
      .delete(`/whitelists/${item.type}/${item.key}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

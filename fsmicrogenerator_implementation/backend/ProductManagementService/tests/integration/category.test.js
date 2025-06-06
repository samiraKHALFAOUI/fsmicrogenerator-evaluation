const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');
const path = require("path");
const fs = require("fs");

describe("category Integration Tests", () => {
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

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/categories")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .field("translations", '{"language":"en","name":"Poc9VqXo"}')
      .field("products", '["478fafd8eb2aee2daae4af3f"]')
      .field("parentCategory", "3ca44218f5e019b1af18adac")
      .field("subCategories", '["2f9d0a0f63c4b0b1f7106bc6"]')
      .attach("icon", path.resolve(__dirname, "../assets/fake-image.png"))
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
    file = res.body.icon;
  });

  it("should get list of categories", async () => {
    const res = await request(app)
      .get("/categories")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get category by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/categories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update category", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/categories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete category", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/categories/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

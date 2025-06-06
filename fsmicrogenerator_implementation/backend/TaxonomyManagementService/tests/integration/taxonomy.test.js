const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("taxonomy Integration Tests", () => {
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

  it("should create a new taxonomy", async () => {
    const res = await request(app)
      .post("/taxonomies")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        logo: "./file/taxonomy/logo.png",
        translations: {
          language: "en",
          designation: "DBnpchYW",
          description: "c1lGNGhi",
        },
        domain: "998b86dc079fba91543f71e4",
        parent: "123928d59c82b477996ea34e",
        children: ["39aa9ff972e8637a9f428d61"],
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of taxonomies", async () => {
    const res = await request(app)
      .get("/taxonomies")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get taxonomy by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/taxonomies/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update taxonomy", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/taxonomies/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete taxonomy", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/taxonomies/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

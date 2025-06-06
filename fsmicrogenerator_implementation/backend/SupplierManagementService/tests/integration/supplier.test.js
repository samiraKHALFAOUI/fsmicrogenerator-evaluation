const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');
const path = require("path");
const fs = require("fs");

describe("supplier Integration Tests", () => {
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

  it("should create a new supplier", async () => {
    const res = await request(app)
      .post("/suppliers")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        logo: "./file/supplier/logo.png",
        translations: {
          language: "en",
          name: "Z1yUEI9z",
          address: "3RG36yU6",
        },
        email: "fUEbJq1o",
        officePhoneNumber: "Jg5bAF1q",
        isActif: false,
        purchases: ["e536da7dca861255733788bf"],
        products: ["741ca2b53d1ccca39248979b"],
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
    file = res.body.logo;
  });

  it("should get list of suppliers", async () => {
    const res = await request(app)
      .get("/suppliers")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get supplier by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/suppliers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update supplier", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/suppliers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete supplier", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/suppliers/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("exchangeRate Integration Tests", () => {
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

  it("should create a new exchangeRate", async () => {
    const res = await request(app)
      .post("/exchangeRates")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        date: new Date("2025-05-12T14:27:03.779Z"),
        refCurrencyBase: "dcbee7530b57209cca5e46a0",
        refCurrencyEtrangere: "29058f62a0a2db859d93339d",
        valeurAchat: 833,
        valeurVente: 505,
        actif: true,
        currency: ["8cce7210e7fb080d2f61fa7e"],
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of exchangeRates", async () => {
    const res = await request(app)
      .get("/exchangeRates")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get exchangeRate by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/exchangeRates/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update exchangeRate", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/exchangeRates/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete exchangeRate", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/exchangeRates/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

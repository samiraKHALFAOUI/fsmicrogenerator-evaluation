const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("langueSite Integration Tests", () => {
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

  it("should create a new langueSite", async () => {
    const res = await request(app)
      .post("/langueSites")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        code: "1fxODmMei",
        translations: {
          language: "en",
          value: "ZQ1gzl4W",
          commentaire: "174xVGFe",
        },
        flag: "Ptb3KQic",
        actif: true,
        ordreAffichage: 903,
        langueParDefault: false,
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of langueSites", async () => {
    const res = await request(app)
      .get("/langueSites")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get langueSite by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/langueSites/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update langueSite", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/langueSites/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete langueSite", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/langueSites/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

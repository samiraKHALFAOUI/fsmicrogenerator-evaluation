const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("domain Integration Tests", () => {
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

  it("should create a new domain", async () => {
    const res = await request(app)
      .post("/domains")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatObjet: "code-1",
        code: "reJ3wysi",
        logo: "./file/domain/logo.png",
        translations: {
          language: "en",
          designation: "zXT2kUwU",
          description: "KTyYxl47",
        },
        hasTaxonomies: true,
        parent: "93cf9fe9a1820cb945bee708",
        children: ["1067789b91909a5f4fd99f75"],
        taxonomies: ["754468ff989a3fdc9bd4a604"],
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of domains", async () => {
    const res = await request(app)
      .get("/domains")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get domain by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/domains/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update domain", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/domains/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatObjet: "code-1" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete domain", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/domains/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

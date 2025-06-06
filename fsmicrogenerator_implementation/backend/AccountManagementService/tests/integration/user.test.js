const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');
const path = require("path");
const fs = require("fs");

describe("user Integration Tests", () => {
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

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("reference", "fm9AbAuk565")
      .field("pseudo", "CPn9EgKp")
      .field("email", "user_email@gmail.com")
      .field("pwCrypte", "ANvldyyu")
      .field("salutation", "code_1232")
      .field(
        "translations",
        '{"language":"en","nom":"VbaMijg8","prenom":"U464KQTl"}'
      )
      .field("fonction", "04e62359c199988d5f01f29f")
      .field("telephone", "rmKNAqBe")
      .field("fixe", "0GgXn8wL")
      .field("nbreConnection", 979)
      .field("dateDerniereConnexion", "2025-05-12T14:33:14.931Z")
      .field("etatCompte", "code_10577")
      .field("etatObjet", "code-1")
      .field("groupe", "7d71309b5b515f8f7e5542e5")
      .attach("photo", path.resolve(__dirname, "../assets/fake-image.png"))
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
    file = res.body.photo;
  });

  it("should get list of users", async () => {
    const res = await request(app)
      .get("/users")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get user by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/users/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update user", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/users/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("reference", "XcILajgR")
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete user", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/users/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

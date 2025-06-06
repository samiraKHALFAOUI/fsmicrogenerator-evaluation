const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');
const path = require("path");
const fs = require("fs");

describe("product Integration Tests", () => {
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

  it("should create a new product", async () => {
    const res = await request(app)
      .post("/products")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .field("reference", "XXtG2HbV")
      .field("category", "878e2ef8edda85e598a9de2a")
      .field(
        "translations",
        '{"language":"en","name":"2tBuy3wU","description":"8Im6kEgc"}'
      )
      .field("salePrice", 739)
      .field("currency", "82e37e275fb03fc6460954ea")
      .field("stockQuantity", 596)
      .field("unit", "01cadf672bc4dc433300209b")
      .field("status", "code_18398")
      .field("supplier", "734f63389721f15aeaa95b66")
      .field("transactionLines", '["de1ce423539cdb1bf5365fa9"]')
      .field("inventoryMovements", '["4f0a49071d22d2897f11b470"]')
      .attach("image", path.resolve(__dirname, "../assets/fake-image.png"))
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
    file = res.body.image;
  });

  it("should get list of products", async () => {
    const res = await request(app)
      .get("/products")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get product by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/products/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update product", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/products/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .field("etatObjet", "code-1")
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete product", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/products/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

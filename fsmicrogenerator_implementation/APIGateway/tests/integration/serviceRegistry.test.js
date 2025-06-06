const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const logger = require('../../middlewares/winston.middleware')

describe("serviceRegistry Integration Tests", () => {
  let token;
  const service = {
    serviceName: "accountManagement",
    protocol: "https",
    host: "127.0.0.1",
    port: 0,
    role: ["authentication"]
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

  it("should register new service", async () => {
    const res = await request(app)
      .post("/registries/register")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send(service)
      .expect(201);
    expect(res.text).toBe(`Successfully registered ${service.serviceName}`);
  });

  it("should update status of an existing service", async () => {
    const res = await request(app)
      .post(`/registries/updateState`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        serviceName: service.serviceName,
        url: `${service.protocol}://${service.host}:${service.port}/`,
        status: 'disabled'
      })
      .expect(200);
    expect(res.text).toBe(`Successfully updated ${service.serviceName} instance status`);
  });

  it("should unregister an existing service", async () => {
    const res = await request(app)
      .post("/registries/unregister")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        serviceName: service.serviceName,
        url: `${service.protocol}://${service.host}:${service.port}/`,
      })
      .expect(200);
    expect(res.text).toBe(`Successfully unregistered ${service.serviceName}`);
  });
});

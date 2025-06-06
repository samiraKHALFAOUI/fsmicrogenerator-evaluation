const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const { closeRedisConnection } = require('../../cache/redisClient');
const { CloseConnection } = require("../../helpers/communications");
const logger = require('../../middlewares/winston.middleware');

describe("menu Integration Tests", () => {
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

  it("should create a new menu", async () => {
    const res = await request(app)
      .post("/menus")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({
        etatDePublication: "code_541",
        etatObjet: "code-1",
        translations: { language: "en", titre: "hmvWw6vt" },
        planPrincipale: false,
        megaMenu: true,
        ordre: 579,
        priorite: 609,
        path: "wfbdLQ4L",
        typeAffichage: "code_13884",
        showAll: false,
        nbrElement: 35,
        typeSelect: "code_13897",
        typeActivation: "code_1960",
        periodeActivation: [
          {
            dateDebut: "2025-05-13T09:31:23.767Z",
            dateFin: "2025-05-13T12:01:26.088Z"
          }
        ],
        periodiciteActivation: {},
        elementAffiche: ["946f7aed53aaaa56c3b18521"],
        menuParent: "b33875af3dcd87cb906907a3",
        menuAssocies: ["c10417c233cebc5420da80c0"],
        menuPrincipal: false,
        actif: false,

        serviceConfig: {
          service: "0epcYsCz",
          classe: "5PSdUeDI",
          option: "sample_option"
        },

        type: "code_13934",
        icon: "bi bi-save"
      })
      .expect(201);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  it("should get list of menus", async () => {
    const res = await request(app)
      .get("/menus")
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get menu by id", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .get(`/menus/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(200);
    expect(res.body).toHaveProperty("_id", createdId);
  });

  it("should update menu", async () => {
    expect(createdId).toBeDefined();
    const res = await request(app)
      .patch(`/menus/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .send({ etatDePublication: "code_541" })
      .expect(200);
    expect(res.body.data).toHaveProperty("_id", createdId);
  });

  it("should delete menu", async () => {
    expect(createdId).toBeDefined();
    await request(app)
      .delete(`/menus/${createdId}`)
      .set(process.env.TOKEN_FIELD_NAME, token)
      .expect(204);
  });
});

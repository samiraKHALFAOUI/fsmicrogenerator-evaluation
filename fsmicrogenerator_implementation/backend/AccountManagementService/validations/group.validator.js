const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  array,
  arrayRequired,
  any,
  objectId,
  boolean,
} = require("../middlewares/commonTypesValidation");
const groupSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  etatUtilisation: string("etatUtilisation")
    .allow(null, "")
    .valid("code_4316", "code_4317"),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      designation: stringRequired("designation"),
    },
    "translations"
  ),
  espaces: arrayRequired("espaces", any("espaces item")),
  users: array("users", objectId("users id")).allow(null, ""),
  superGroup: boolean("superGroup").allow(null, ""),
});

const groupSchemaMany = arrayRequired(
  "group item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    etatUtilisation: string("etatUtilisation")
      .allow(null, "")
      .valid("code_4316", "code_4317"),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        designation: stringRequired("designation"),
      },
      "translations"
    ),
    espaces: arrayRequired("espaces", any("espaces item")),
    users: array("users", objectId("users id")).allow(null, ""),
    superGroup: boolean("superGroup").allow(null, ""),
  })
);

const groupUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  etatUtilisation: string("etatUtilisation")
    .allow(null, "")
    .valid("code_4316", "code_4317"),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      designation: string("designation"),
    },
    "translations"
  ),
  espaces: array("espaces", any("espaces item")),
  users: array("users", objectId("users id")).allow(null, ""),
  superGroup: boolean("superGroup").allow(null, ""),
});

const groupTranslateSchema = joiObject({
  translations: arrayRequired(
    "group translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      designation: stringRequired("designation"),
    })
  ),
});

module.exports = {
  schema: groupSchema,
  schemaMany: groupSchemaMany,
  updateSchema: groupUpdateSchema,
  translateSchema: groupTranslateSchema,
};

const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  arrayRequired,
  objectId,
} = require("../middlewares/commonTypesValidation");
const enumerationSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: stringRequired("code"),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      valeur: stringRequired("valeur"),
      commentaire: string("commentaire").allow(null, ""),
    },
    "translations"
  ),
  etatValidation: stringRequired("etatValidation").valid(
    "code_223",
    "code_4268",
    "code_1407"
  ),
});

const enumerationSchemaMany = arrayRequired(
  "enumeration item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    code: stringRequired("code"),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        valeur: stringRequired("valeur"),
        commentaire: string("commentaire").allow(null, ""),
      },
      "translations"
    ),
    etatValidation: stringRequired("etatValidation").valid(
      "code_223",
      "code_4268",
      "code_1407"
    ),
  })
);

const enumerationUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: string("code"),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      valeur: string("valeur"),
      commentaire: string("commentaire").allow(null, ""),
    },
    "translations"
  ),
  etatValidation: string("etatValidation").valid(
    "code_223",
    "code_4268",
    "code_1407"
  ),
});

const enumerationTranslateSchema = joiObject({
  translations: arrayRequired(
    "enumeration translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      valeur: stringRequired("valeur"),
      commentaire: string("commentaire").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: enumerationSchema,
  schemaMany: enumerationSchemaMany,
  updateSchema: enumerationUpdateSchema,
  translateSchema: enumerationTranslateSchema,
};

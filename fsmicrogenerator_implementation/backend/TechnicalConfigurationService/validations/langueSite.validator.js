const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  boolean,
  booleanRequired,
  number,
  numberRequired,
  arrayRequired,
  objectId,
} = require("../middlewares/commonTypesValidation");
const langueSiteSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: stringRequired("code"),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      value: stringRequired("value"),
      commentaire: string("commentaire").allow(null, ""),
    },
    "translations"
  ),
  flag: string("flag").allow(null, ""),
  actif: booleanRequired("actif"),
  ordreAffichage: numberRequired("ordreAffichage"),
  langueParDefault: booleanRequired("langueParDefault"),
});

const langueSiteSchemaMany = arrayRequired(
  "langueSite item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    code: stringRequired("code"),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        value: stringRequired("value"),
        commentaire: string("commentaire").allow(null, ""),
      },
      "translations"
    ),
    flag: string("flag").allow(null, ""),
    actif: booleanRequired("actif"),
    ordreAffichage: numberRequired("ordreAffichage"),
    langueParDefault: booleanRequired("langueParDefault"),
  })
);

const langueSiteUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: string("code"),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      value: string("value"),
      commentaire: string("commentaire").allow(null, ""),
    },
    "translations"
  ),
  flag: string("flag").allow(null, ""),
  actif: boolean("actif"),
  ordreAffichage: number("ordreAffichage"),
  langueParDefault: boolean("langueParDefault"),
});

const langueSiteTranslateSchema = joiObject({
  translations: arrayRequired(
    "langueSite translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      value: stringRequired("value"),
      commentaire: string("commentaire").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: langueSiteSchema,
  schemaMany: langueSiteSchemaMany,
  updateSchema: langueSiteUpdateSchema,
  translateSchema: langueSiteTranslateSchema,
};

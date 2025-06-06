const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  objectId,
  array,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const taxonomiesSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  logo: string("logo").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      designation: stringRequired("designation"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  domain: objectId("domain").allow(null, ""),
  parent: objectId("parent").allow(null, ""),
  children: array("children", objectId("children id")).allow(null, ""),
});

const taxonomiesSchemaMany = arrayRequired(
  "taxonomies item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    logo: string("logo").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        designation: stringRequired("designation"),
        description: string("description").allow(null, ""),
      },
      "translations"
    ),
    domain: objectId("domain").allow(null, ""),
    parent: objectId("parent").allow(null, ""),
    children: array("children", objectId("children id")).allow(null, ""),
  })
);

const taxonomiesUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  logo: string("logo").allow(null, ""),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      designation: string("designation"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  domain: objectId("domain").allow(null, ""),
  parent: objectId("parent").allow(null, ""),
  children: array("children", objectId("children id")).allow(null, ""),
});

const taxonomiesTranslateSchema = joiObject({
  translations: arrayRequired(
    "taxonomies translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      designation: stringRequired("designation"),
      description: string("description").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: taxonomiesSchema,
  schemaMany: taxonomiesSchemaMany,
  updateSchema: taxonomiesUpdateSchema,
  translateSchema: taxonomiesTranslateSchema,
};

const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  boolean,
  objectId,
  array,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const domainSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: stringRequired("code"),
  logo: string("logo").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      designation: stringRequired("designation"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  hasTaxonomies: boolean("hasTaxonomies").allow(null, ""),
  parent: objectId("parent").allow(null, ""),
  children: array("children", objectId("children id")).allow(null, ""),
  taxonomies: array("taxonomies", objectId("taxonomies id")).allow(null, ""),
});

const domainSchemaMany = arrayRequired(
  "domain item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    code: stringRequired("code"),
    logo: string("logo").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        designation: stringRequired("designation"),
        description: string("description").allow(null, ""),
      },
      "translations"
    ),
    hasTaxonomies: boolean("hasTaxonomies").allow(null, ""),
    parent: objectId("parent").allow(null, ""),
    children: array("children", objectId("children id")).allow(null, ""),
    taxonomies: array("taxonomies", objectId("taxonomies id")).allow(null, ""),
  })
);

const domainUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  code: string("code"),
  logo: string("logo").allow(null, ""),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      designation: string("designation"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  hasTaxonomies: boolean("hasTaxonomies").allow(null, ""),
  parent: objectId("parent").allow(null, ""),
  children: array("children", objectId("children id")).allow(null, ""),
  taxonomies: array("taxonomies", objectId("taxonomies id")).allow(null, ""),
});

const domainTranslateSchema = joiObject({
  translations: arrayRequired(
    "domain translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      designation: stringRequired("designation"),
      description: string("description").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: domainSchema,
  schemaMany: domainSchemaMany,
  updateSchema: domainUpdateSchema,
  translateSchema: domainTranslateSchema,
};

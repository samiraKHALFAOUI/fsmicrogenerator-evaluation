const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  array,
  arrayRequired,
  objectId,
  objectIdRequired,
} = require("../middlewares/commonTypesValidation");
const categorySchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  icon: string("icon").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      name: stringRequired("name"),
    },
    "translations"
  ),
  products: array("products", objectId("products id")).allow(null, ""),
  parentCategory: objectId("parentCategory").allow(null, ""),
  subCategories: array("subCategories", objectId("subCategories id")).allow(
    null,
    ""
  ),
});

const categorySchemaMany = arrayRequired(
  "category item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    icon: string("icon").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        name: stringRequired("name"),
      },
      "translations"
    ),
    products: array("products", objectId("products id")).allow(null, ""),
    parentCategory: objectId("parentCategory").allow(null, ""),
    subCategories: array("subCategories", objectId("subCategories id")).allow(
      null,
      ""
    ),
  })
);

const categoryUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  icon: string("icon").allow(null, ""),
  translations: joiObject(
    { language: string("language").allow(null, ""), name: string("name") },
    "translations"
  ),
  products: array("products", objectId("products id")).allow(null, ""),
  parentCategory: objectId("parentCategory").allow(null, ""),
  subCategories: array("subCategories", objectId("subCategories id")).allow(
    null,
    ""
  ),
});

const categoryTranslateSchema = joiObject({
  translations: arrayRequired(
    "category translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      name: stringRequired("name"),
    })
  ),
});

module.exports = {
  schema: categorySchema,
  schemaMany: categorySchemaMany,
  updateSchema: categoryUpdateSchema,
  translateSchema: categoryTranslateSchema,
};

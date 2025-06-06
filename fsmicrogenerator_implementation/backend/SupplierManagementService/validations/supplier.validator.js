const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  array,
  arrayRequired,
  objectId,
  boolean,
  booleanRequired,
} = require("../middlewares/commonTypesValidation");
const supplierSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  logo: string("logo").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      name: stringRequired("name"),
      address: stringRequired("address"),
    },
    "translations"
  ),
  email: stringRequired("email"),
  officePhoneNumber: stringRequired("officePhoneNumber"),
  isActif: booleanRequired("isActif"),
  purchases: array("purchases", objectId("purchases item")),
  products: array("products", objectId("products item"))
});

const supplierSchemaMany = arrayRequired(
  "supplier item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    logo: string("logo").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        name: stringRequired("name"),
        address: stringRequired("address"),
      },
      "translations"
    ),
    email: stringRequired("email"),
    officePhoneNumber: stringRequired("officePhoneNumber"),
    isActif: booleanRequired("isActif"),
    purchases: array("purchases", objectId("purchases item")),
    products: array("products", objectId("products item")),

  })
);

const supplierUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  logo: string("logo").allow(null, ""),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      name: string("name"),
      address: string("address"),
    },
    "translations"
  ),
  email: string("email"),
  officePhoneNumber: string("officePhoneNumber"),
  isActif: boolean("isActif"),
  purchases: array("purchases", objectId("purchases item")),
  products: array("products", objectId("products item"))
});

const supplierTranslateSchema = joiObject({
  translations: arrayRequired(
    "supplier translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      name: stringRequired("name"),
      address: stringRequired("address"),
    })
  ),
});

module.exports = {
  schema: supplierSchema,
  schemaMany: supplierSchemaMany,
  updateSchema: supplierUpdateSchema,
  translateSchema: supplierTranslateSchema,
};

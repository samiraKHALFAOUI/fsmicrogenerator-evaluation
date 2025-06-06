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
const customerSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  photo: string("photo").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      name: stringRequired("name"),
      address: string("address").allow(null, ""),
    },
    "translations"
  ),
  email: stringRequired("email"),
  phoneNumber: stringRequired("phoneNumber"),
  orders: array("orders", objectId("orders item")),
});

const customerSchemaMany = arrayRequired(
  "customer item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    photo: string("photo").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        name: stringRequired("name"),
        address: string("address").allow(null, ""),
      },
      "translations"
    ),
    email: stringRequired("email"),
    phoneNumber: stringRequired("phoneNumber"),
    orders: array("orders", objectId("orders item")),
  })
);

const customerUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  photo: string("photo").allow(null, ""),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      name: string("name"),
      address: string("address").allow(null, ""),
    },
    "translations"
  ),
  email: string("email"),
  phoneNumber: string("phoneNumber"),
  orders: array("orders", objectId("orders item")),
});

const customerTranslateSchema = joiObject({
  translations: arrayRequired(
    "customer translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      name: stringRequired("name"),
      address: string("address").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: customerSchema,
  schemaMany: customerSchemaMany,
  updateSchema: customerUpdateSchema,
  translateSchema: customerTranslateSchema,
};

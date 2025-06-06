const {
  joiObject,
  string,
  stringRequired,
  objectId,
  objectIdRequired,
  joiObjectRequired,
  number,
  array,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const productSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  reference: stringRequired("reference"),
  category: objectId("category").allow(null, ""),
  image: string("image").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      name: stringRequired("name"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  salePrice: number("salePrice").allow(null, ""),
  currency: objectId("currency").allow(null, ""),
  stockQuantity: number("stockQuantity").allow(null, "").min(0),
  unit: objectId("unit").allow(null, ""),
  status: stringRequired("status").valid(
    "code_18398",
    "code_18399",
    "code_18400"
  ),
  supplier: objectIdRequired("supplier"),
  transactionLines: array(
    "transactionLines",
    objectId("transactionLines item")
  ),
  inventoryMovements: array(
    "inventoryMovements",
    objectId("inventoryMovements item")
  )
});

const productSchemaMany = arrayRequired(
  "product item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    reference: stringRequired("reference"),
    category: objectId("category").allow(null, ""),
    image: string("image").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        name: stringRequired("name"),
        description: string("description").allow(null, ""),
      },
      "translations"
    ),
    salePrice: number("salePrice").allow(null, ""),
    currency: objectId("currency").allow(null, ""),
    stockQuantity: number("stockQuantity").allow(null, "").min(0),
    unit: objectId("unit").allow(null, ""),
    status: stringRequired("status").valid(
      "code_18398",
      "code_18399",
      "code_18400"
    ),
    supplier: objectIdRequired("supplier"),
    transactionLines: array(
      "transactionLines",
      objectId("transactionLines item")
    ),
    inventoryMovements: array(
      "inventoryMovements",
      objectId("inventoryMovements item")
    ),

  })
);

const productUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  reference: string("reference"),
  category: objectId("category").allow(null, ""),
  image: string("image").allow(null, ""),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      name: string("name"),
      description: string("description").allow(null, ""),
    },
    "translations"
  ),
  salePrice: number("salePrice").allow(null, ""),
  currency: objectId("currency").allow(null, ""),
  stockQuantity: number("stockQuantity").allow(null, "").min(0),
  unit: objectId("unit").allow(null, ""),
  status: string("status").valid("code_18398", "code_18399", "code_18400"),
  supplier: objectId("supplier"),
  transactionLines: array(
    "transactionLines",
    objectId("transactionLines item")
  ),
  inventoryMovements: array(
    "inventoryMovements",
    objectId("inventoryMovements item")
  )
});

const productTranslateSchema = joiObject({
  translations: arrayRequired(
    "product translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      name: stringRequired("name"),
      description: string("description").allow(null, ""),
    })
  ),
});

module.exports = {
  schema: productSchema,
  schemaMany: productSchemaMany,
  updateSchema: productUpdateSchema,
  translateSchema: productTranslateSchema,
};

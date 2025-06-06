const {
  joiObject,
  string,
  objectId,
  objectIdRequired,
  number,
  numberRequired,
  arrayRequired,
  array,
} = require("../middlewares/commonTypesValidation");
const transactionLineSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  product: objectIdRequired("product"),
  quantity: numberRequired("quantity").min(0),
  price: numberRequired("price").min(0),
  currency: objectIdRequired("currency"),
  transaction: objectIdRequired("transaction").allow(null, ""),
  inventoryMovement: array("inventoryMovement" , objectId("inventoryMovement item")).allow(null, "")
});

const transactionLineSchemaMany = arrayRequired(
  "transactionLine item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    product: objectIdRequired("product"),
    quantity: numberRequired("quantity").min(0),
    price: numberRequired("price").min(0),
    currency: objectIdRequired("currency"),
    transaction: objectIdRequired("transaction").allow(null, ""),
    inventoryMovement: array("inventoryMovement" , objectId("inventoryMovement item")).allow(null, ""),
  })
);

const transactionLineUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  product: objectId("product"),
  quantity: number("quantity").min(0),
  price: number("price").min(0),
  currency: objectId("currency"),
  transaction: objectId("transaction").allow(null, ""),
  inventoryMovement: array("inventoryMovement" , objectId("inventoryMovement item")).allow(null, "")
});

module.exports = {
  schema: transactionLineSchema,
  schemaMany: transactionLineSchemaMany,
  updateSchema: transactionLineUpdateSchema,
};

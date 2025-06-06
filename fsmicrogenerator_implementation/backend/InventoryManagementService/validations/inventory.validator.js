const {
  joiObject,
  string,
  stringRequired,
  objectId,
  objectIdRequired,
  date,
  dateRequired,
  number,
  numberRequired,
  arrayRequired
} = require("../middlewares/commonTypesValidation");
const inventorySchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  product: objectIdRequired("product"),
  type: stringRequired("type").valid("code_18416", "code_18417"),
  raison: stringRequired("raison"),
  date: dateRequired("date"),
  quantity: number("quantity").allow(null, "").min(1),
  price: numberRequired("price").min(0),
  transactionLine: objectIdRequired("transactionLine")
});

const inventorySchemaMany = arrayRequired(
  "inventory item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    product: objectIdRequired("product"),
    type: stringRequired("type").valid("code_18416", "code_18417"),
    raison: stringRequired("raison"),
    date: dateRequired("date"),
    quantity: number("quantity").allow(null, "").min(1),
    price: numberRequired("price").min(0),
    transactionLine: objectIdRequired("transactionLine")
  })
);

const inventoryUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  product: objectId("product"),
  type: string("type").valid("code_18416", "code_18417"),
  raison: string("raison"),
  date: date("date"),
  quantity: number("quantity").allow(null, "").min(1),
  price: number("price").min(0),
  transactionLine: objectId("transactionLine")
});

module.exports = {
  schema: inventorySchema,
  schemaMany: inventorySchemaMany,
  updateSchema: inventoryUpdateSchema
};

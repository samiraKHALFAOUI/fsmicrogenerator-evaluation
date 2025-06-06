const {
  joiObject,
  string,
  stringRequired,
  date,
  dateRequired,
  objectId,
  objectIdRequired,
  array,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const transactionSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  reference: stringRequired("reference"),
  type: stringRequired("type").valid("code_18440", "code_18441"),
  registrationDate: dateRequired("registrationDate"),
  status: stringRequired("status").valid(
    "code_1166",
    "code_1167",
    "code_18436",
    "code_18437",
    "code_18438",
    "code_18439"
  ),
  savedBy: objectIdRequired("savedBy"),
  transactionLines: array(
    "transactionLines",
    objectId("transactionLines id")
  ).allow(null, ""),
  supplier: objectId("supplier").allow(null, ""),
  customer: objectId("customer").allow(null, "")
});

const transactionSchemaMany = arrayRequired(
  "transaction item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    reference: stringRequired("reference"),
    type: stringRequired("type").valid("code_18440", "code_18441"),
    registrationDate: dateRequired("registrationDate"),
    status: stringRequired("status").valid(
      "code_1166",
      "code_1167",
      "code_18436",
      "code_18437",
      "code_18438",
      "code_18439"
    ),
    savedBy: objectIdRequired("savedBy"),
    transactionLines: array(
      "transactionLines",
      objectId("transactionLines id")
    ).allow(null, ""),
    supplier: objectId("supplier").allow(null, ""),
    customer: objectId("customer").allow(null, ""),
  })
);

const transactionUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  reference: string("reference"),
  type: string("type").valid("code_18440", "code_18441"),
  registrationDate: date("registrationDate"),
  status: string("status").valid(
    "code_1166",
    "code_1167",
    "code_18436",
    "code_18437",
    "code_18438",
    "code_18439"
  ),
  savedBy: objectId("savedBy"),
  transactionLines: array(
    "transactionLines",
    objectId("transactionLines id")
  ).allow(null, ""),
  supplier: objectId("supplier").allow(null, ""),
  customer: objectId("customer").allow(null, "")
});

module.exports = {
  schema: transactionSchema,
  schemaMany: transactionSchemaMany,
  updateSchema: transactionUpdateSchema,
};

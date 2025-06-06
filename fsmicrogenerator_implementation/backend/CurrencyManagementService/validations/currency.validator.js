const {
  joiObject,
  string,
  stringRequired,
  array,
  arrayRequired,
  objectId,
} = require("../middlewares/commonTypesValidation");
const currencySchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  currency: stringRequired("currency"),
  typeCurrency: stringRequired("typeCurrency").valid(
    "code_3630",
    "code_3631"
  ),
  symbolCurrency: string("symbolCurrency").allow(null, ""),
  exchangeRates: array("exchangeRates", objectId("exchangeRates id")).allow(null, ""),
});

const currencySchemaMany = arrayRequired(
  "currency item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    currency: stringRequired("currency"),
    typeCurrency: stringRequired("typeCurrency").valid(
      "code_3630",
      "code_3631"
    ),
    symbolCurrency: string("symbolCurrency").allow(null, ""),
    exchangeRates: array("exchangeRates", objectId("exchangeRates id")).allow(
      null,
      ""
    ),
  })
);

const currencyUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  currency: string("currency"),
  typeCurrency: string("typeCurrency").valid(
    "code_3630",
    "code_3631"
  ),
  symbolCurrency: string("symbolCurrency").allow(null, ""),
  exchangeRates: array("exchangeRates", objectId("exchangeRates id")).allow(null, ""),
});

module.exports = {
  schema: currencySchema,
  schemaMany: currencySchemaMany,
  updateSchema: currencyUpdateSchema,
};

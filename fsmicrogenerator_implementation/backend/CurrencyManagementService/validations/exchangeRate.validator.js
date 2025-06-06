const {
  joiObject,
  string,
  date,
  objectId,
  objectIdRequired,
  number,
  boolean,
  array,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const exchangeRateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  date: date("date").allow(null, ""),
  refCurrencyBase: objectIdRequired("refCurrencyBase").allow(null, ""),
  refCurrencyEtrangere: objectIdRequired("refCurrencyEtrangere").allow(null, ""),
  valeurAchat: number("valeurAchat").allow(null, ""),
  valeurVente: number("valeurVente").allow(null, ""),
  actif: boolean("actif").allow(null, ""),
  currency: array("currency", objectId("currency id")).allow(null, ""),
});

const exchangeRateSchemaMany = arrayRequired(
  "exchangeRate item",
  joiObject({
    etatObjet: string("etatObjet").allow(null, ""),
    date: date("date").allow(null, ""),
    refCurrencyBase: objectIdRequired("refCurrencyBase").allow(null, ""),
    refCurrencyEtrangere: objectIdRequired("refCurrencyEtrangere").allow(
      null,
      ""
    ),
    valeurAchat: number("valeurAchat").allow(null, ""),
    valeurVente: number("valeurVente").allow(null, ""),
    actif: boolean("actif").allow(null, ""),
    currency: array("currency", objectId("currency id")).allow(null, ""),
  })
);

const exchangeRateUpdateSchema = joiObject({
  etatObjet: string("etatObjet").allow(null, ""),
  date: date("date").allow(null, ""),
  refCurrencyBase: objectId("refCurrencyBase").allow(null, ""),
  refCurrencyEtrangere: objectId("refCurrencyEtrangere").allow(null, ""),
  valeurAchat: number("valeurAchat").allow(null, ""),
  valeurVente: number("valeurVente").allow(null, ""),
  actif: boolean("actif").allow(null, ""),
  currency: array("currency", objectId("currency id")).allow(null, ""),
});

module.exports = {
  schema: exchangeRateSchema,
  schemaMany: exchangeRateSchemaMany,
  updateSchema: exchangeRateUpdateSchema,
};

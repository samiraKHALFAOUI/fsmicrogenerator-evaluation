const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  objectId,
  objectIdRequired,
  number,
  date,
  arrayRequired,
} = require("../middlewares/commonTypesValidation");
const userSchema = joiObject({
  reference: stringRequired("reference"),
  pseudo: stringRequired("pseudo"),
  email: stringRequired("email"),
  pwCrypte: stringRequired("pwCrypte"),
  salutation: stringRequired("salutation").valid("code_1232", "code_1233"),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      nom: stringRequired("nom"),
      prenom: stringRequired("prenom"),
    },
    "translations"
  ),
  fonction: objectIdRequired("fonction").allow(null, ""),
  photo: string("photo").allow(null, ""),
  telephone: stringRequired("telephone"),
  fixe: string("fixe").allow(null, ""),
  nbreConnection: number("nbreConnection").allow(null, ""),
  dateDerniereConnexion: date("dateDerniereConnexion").allow(null, ""),
  etatCompte: stringRequired("etatCompte").valid(
    "code_10577",
    "code_4316",
    "code_4317",
    "code_226"
  ),
  etatObjet: string("etatObjet").allow(null, ""),
  groupe: objectIdRequired("groupe").allow(null, ""),
});

const userSchemaMany = arrayRequired(
  "user item",
  joiObject({
    reference: stringRequired("reference"),
    pseudo: stringRequired("pseudo"),
    email: stringRequired("email"),
    pwCrypte: stringRequired("pwCrypte"),
    salutation: stringRequired("salutation").valid("code_1232", "code_1233"),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        nom: stringRequired("nom"),
        prenom: stringRequired("prenom"),
      },
      "translations"
    ),
    fonction: objectIdRequired("fonction").allow(null, ""),
    photo: string("photo").allow(null, ""),
    telephone: stringRequired("telephone"),
    fixe: string("fixe").allow(null, ""),
    nbreConnection: number("nbreConnection").allow(null, ""),
    dateDerniereConnexion: date("dateDerniereConnexion").allow(null, ""),
    etatCompte: stringRequired("etatCompte").valid(
      "code_10577",
      "code_4316",
      "code_4317",
      "code_226"
    ),
    etatObjet: string("etatObjet").allow(null, ""),
    groupe: objectIdRequired("groupe").allow(null, ""),
  })
);

const userUpdateSchema = joiObject({
  reference: string("reference"),
  pseudo: string("pseudo"),
  email: string("email"),
  pwCrypte: string("pwCrypte"),
  salutation: string("salutation").valid("code_1232", "code_1233"),
  translations: joiObject(
    {
      language: string("language").allow(null, ""),
      nom: string("nom"),
      prenom: string("prenom"),
    },
    "translations"
  ),
  fonction: objectId("fonction").allow(null, ""),
  photo: string("photo").allow(null, ""),
  telephone: string("telephone"),
  fixe: string("fixe").allow(null, ""),
  nbreConnection: number("nbreConnection").allow(null, ""),
  dateDerniereConnexion: date("dateDerniereConnexion").allow(null, ""),
  etatCompte: string("etatCompte").valid(
    "code_10577",
    "code_4316",
    "code_4317",
    "code_226"
  ),
  etatObjet: string("etatObjet").allow(null, ""),
  groupe: objectId("groupe").allow(null, ""),
});

const userTranslateSchema = joiObject({
  translations: arrayRequired(
    "user translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      nom: stringRequired("nom"),
      prenom: stringRequired("prenom"),
    })
  ),
});

module.exports = {
  schema: userSchema,
  schemaMany: userSchemaMany,
  updateSchema: userUpdateSchema,
  translateSchema: userTranslateSchema,
};

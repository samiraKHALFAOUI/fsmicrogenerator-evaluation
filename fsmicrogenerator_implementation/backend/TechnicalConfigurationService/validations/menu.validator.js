const {
  joiObject,
  string,
  stringRequired,
  joiObjectRequired,
  number,
  numberRequired,
  date,
  dateRequired,
  arrayRequired,
  array,
  any,
  objectId,
  boolean,
  booleanRequired,
} = require("../middlewares/commonTypesValidation");
const menuSchema = joiObject({
  etatDePublication: stringRequired("etatDePublication").valid(
    "code_541",
    "code_223",
    "code_224",
    "code_11201",
    "code_3417"
  ),
  etatObjet: string("etatObjet").allow(null, ""),
  translations: joiObjectRequired(
    {
      language: string("language").allow(null, ""),
      titre: stringRequired("titre"),
    },
    "translations"
  ),
  planPrincipale: booleanRequired("planPrincipale"),
  megaMenu: booleanRequired("megaMenu"),
  icon: string("icon").allow(null, ""),
  ordre: numberRequired("ordre"),
  priorite: numberRequired("priorite"),
  path: string("path").allow(null, ""),
  typeAffichage: string("typeAffichage").allow(null).valid(
    "code_13884",
    "code_13883",
    "code_2021",
    "code_187",
    "code_13926",
    "code_13927"
  ),
  nbrElement: numberRequired("nbrElement"),
  showAll: boolean('showAll').allow(null),
  typeSelect: string("typeSelect").allow(null).valid(
    "code_13897",
    "code_13898",
    "code_13899",
    "code_13900",
    "code_13901"
  ),
  typeActivation: stringRequired("typeActivation").valid(
    "code_1960",
    "code_1962",
    "code_1963"
  ),
  periodeActivation: array(
    "periodeActivation",
    joiObject({
      dateDebut: dateRequired("dateDebut"),
      dateFin: date("dateFin").allow(null, ""),
    })
  ),
  periodiciteActivation: any(),
  elementAffiche: array("elementAffiche", objectId("elementAffiche item")),
  menuParent: objectId("menuParent").allow(null, ""),
  menuAssocies: array("menuAssocies", objectId("menuAssocies id")).allow(
    null,
    ""
  ),
  menuPrincipal: booleanRequired("menuPrincipal"),
  actif: booleanRequired("actif"),
  serviceConfig: any('serviceConfig'),
  type: stringRequired("type").valid("code_13934", "code_5041", "code_13994"),
});

const menuSchemaMany = arrayRequired(
  "menu item",
  joiObject({
    etatDePublication: stringRequired("etatDePublication").valid(
      "code_541",
      "code_223",
      "code_224",
      "code_11201",
      "code_3417"
    ),
    etatObjet: string("etatObjet").allow(null, ""),
    translations: joiObjectRequired(
      {
        language: string("language").allow(null, ""),
        titre: stringRequired("titre"),
      },
      "translations"
    ),
    planPrincipale: booleanRequired("planPrincipale"),
    megaMenu: booleanRequired("megaMenu"),
    icon: string("icon").allow(null, ""),
    ordre: numberRequired("ordre"),
    priorite: numberRequired("priorite"),
    path: string("path").allow(null, ""),
    typeAffichage: string("typeAffichage").allow(null).valid(
      "code_13884",
      "code_13883",
      "code_2021",
      "code_187",
      "code_13926",
      "code_13927"
    ),
    nbrElement: numberRequired("nbrElement"),
    showAll: boolean('showAll').allow(null),
    typeSelect: string("typeSelect").allow(null).valid(
      "code_13897",
      "code_13898",
      "code_13899",
      "code_13900",
      "code_13901"
    ),
    typeActivation: stringRequired("typeActivation").valid(
      "code_1960",
      "code_1962",
      "code_1963"
    ),
    periodeActivation: array(
      "periodeActivation",
      joiObject({
        dateDebut: dateRequired("dateDebut"),
        dateFin: date("dateFin").allow(null, ""),
      })
    ),
    periodiciteActivation: any(),
    elementAffiche: array("elementAffiche", objectId("elementAffiche item")),

    menuParent: objectId("menuParent").allow(null, ""),
    menuAssocies: array("menuAssocies", objectId("menuAssocies id")).allow(
      null,
      ""
    ),
    menuPrincipal: booleanRequired("menuPrincipal"),
    actif: booleanRequired("actif"),
    serviceConfig: any('serviceConfig'),
    type: stringRequired("type").valid("code_13934", "code_5041", "code_13994"),
  })
);

const menuUpdateSchema = joiObject({
  etatDePublication: string("etatDePublication").valid(
    "code_541",
    "code_223",
    "code_224",
    "code_11201",
    "code_3417"
  ),
  etatObjet: string("etatObjet").allow(null, ""),
  translations: joiObject(
    { language: string("language").allow(null, ""), titre: string("titre") },
    "translations"
  ),
  planPrincipale: boolean("planPrincipale"),
  megaMenu: boolean("megaMenu"),
  icon: string("icon").allow(null, ""),
  ordre: number("ordre"),
  priorite: number("priorite"),
  path: string("path").allow(null, ""),
  typeAffichage: string("typeAffichage").allow(null).valid(
    "code_13884",
    "code_13883",
    "code_2021",
    "code_187",
    "code_13926",
    "code_13927"
  ),
  nbrElement: number("nbrElement"),
  showAll: boolean('showAll').allow(null),
  typeSelect: string("typeSelect").allow(null).valid(
    "code_13897",
    "code_13898",
    "code_13899",
    "code_13900",
    "code_13901"
  ),
  typeActivation: string("typeActivation").valid(
    "code_1960",
    "code_1962",
    "code_1963"
  ),
  periodeActivation: array(
    "periodeActivation",
    joiObject({
      dateDebut: date("dateDebut"),
      dateFin: date("dateFin").allow(null, ""),
    })
  ),
  periodiciteActivation: any(),
  elementAffiche: array("elementAffiche", objectId("elementAffiche item")),
  menuParent: objectId("menuParent").allow(null, ""),
  menuAssocies: array("menuAssocies", objectId("menuAssocies id")).allow(
    null,
    ""
  ),
  menuPrincipal: boolean("menuPrincipal"),
  actif: boolean("actif"),
  serviceConfig: any('serviceConfig'),
  type: string("type").valid("code_13934", "code_5041", "code_13994"),
});

const menuTranslateSchema = joiObject({
  translations: arrayRequired(
    "menu translations ",
    joiObject({
      _id: objectId("_id").allow(null, ""),
      language: stringRequired("language"),
      titre: stringRequired("titre"),
    })
  ),
});

module.exports = {
  schema: menuSchema,
  schemaMany: menuSchemaMany,
  updateSchema: menuUpdateSchema,
  translateSchema: menuTranslateSchema,
};

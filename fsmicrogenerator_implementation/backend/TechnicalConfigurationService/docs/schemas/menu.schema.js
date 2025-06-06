/**
 * @swagger
 * components:
 *   schemas:
 *     menu:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatDePublication:
 *           type: string
 *         etatObjet:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             titre:
 *               type: string
 *         planPrincipale:
 *           type: boolean
 *         megaMenu:
 *           type: boolean
 *         icon:
 *           type: string
 *         ordre:
 *           type: number
 *         priorite:
 *           type: number
 *         path:
 *           type: string
 *         typeAffichage:
 *           type: string
 *         showAll:
 *           type: boolean
 *         nbrElement:
 *           type: number
 *         typeSelect:
 *           type: string
 *         typeActivation:
 *           type: string
 *         periodeActivation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dateDebut:
 *                 type: string
 *               dateFin:
 *                 type: string
 *         periodiciteActivation:
 *           type: object
 *         elementAffiche:
 *           type: array
 *           items:
 *             type: string
 *         menuParent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/menu'
 *         menuAssocies:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/menu'
 *         menuPrincipal:
 *           type: boolean
 *         actif:
 *           type: boolean
 *         serviceConfig:
 *           type: object
 *           properties:
 *             service:
 *               type: string
 *             classe:
 *               type: string
 *             option:
 *               type: object
 *         type:
 *           type: string
 *     menuCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatDePublication:
 *           type: string
 *           enum: "code_541, code_223, code_224, code_11201, code_3417"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             titre:
 *               type: string
 *         planPrincipale:
 *           type: boolean
 *         megaMenu:
 *           type: boolean
 *         icon:
 *           type: string
 *         ordre:
 *           type: number
 *         priorite:
 *           type: number
 *         path:
 *           type: string
 *         typeAffichage:
 *           type: string
 *           enum: "code_13884, code_13883, code_2021, code_187, code_13926, code_13927, "
 *         showAll:
 *           type: boolean
 *         nbrElement:
 *           type: number
 *         typeSelect:
 *           type: string
 *           enum: "code_13897, code_13898, code_13899, code_13900, code_13901, "
 *         typeActivation:
 *           type: string
 *           enum: "code_1960, code_1962, code_1963"
 *         periodeActivation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *         periodiciteActivation:
 *           type: object
 *         elementAffiche:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         menuParent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to menu
 *         menuAssocies:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to menu
 *         menuPrincipal:
 *           type: boolean
 *         actif:
 *           type: boolean
 *         serviceConfig:
 *           type: object
 *           properties:
 *             service:
 *               type: string
 *             classe:
 *               type: string
 *             option:
 *               type: object
 *         type:
 *           type: string
 *           enum: "code_13934, code_5041, code_13994"
 *       required: ["etatDePublication", "planPrincipale", "megaMenu", "ordre", "priorite", "typeActivation", "menuPrincipal", "actif", "type"]
 *     menuUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatDePublication:
 *           type: string
 *           enum: "code_541, code_223, code_224, code_11201, code_3417"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             titre:
 *               type: string
 *         planPrincipale:
 *           type: boolean
 *         megaMenu:
 *           type: boolean
 *         icon:
 *           type: string
 *         ordre:
 *           type: number
 *         priorite:
 *           type: number
 *         path:
 *           type: string
 *         typeAffichage:
 *           type: string
 *           enum: "code_13884, code_13883, code_2021, code_187, code_13926, code_13927, "
 *         showAll:
 *           type: boolean
 *         nbrElement:
 *           type: number
 *         typeSelect:
 *           type: string
 *           enum: "code_13897, code_13898, code_13899, code_13900, code_13901, "
 *         typeActivation:
 *           type: string
 *           enum: "code_1960, code_1962, code_1963"
 *         periodeActivation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *         periodiciteActivation:
 *           type: object
 *         elementAffiche:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         menuParent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to menu
 *         menuAssocies:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to menu
 *         menuPrincipal:
 *           type: boolean
 *         actif:
 *           type: boolean
 *         serviceConfig:
 *           type: object
 *           properties:
 *             service:
 *               type: string
 *             classe:
 *               type: string
 *             option:
 *               type: object
 *         type:
 *           type: string
 *           enum: "code_13934, code_5041, code_13994"
 *       required: ["etatDePublication", "planPrincipale", "megaMenu", "ordre", "priorite", "typeActivation", "menuPrincipal", "actif", "type"]
 *     menuTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         titre:
 *           type: string
 *       required: ["language", "titre"]
 *     menuGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatDePublication:
 *           type: string
 *           enum: "code_541, code_223, code_224, code_11201, code_3417"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               titre:
 *                 type: string
 *         planPrincipale:
 *           type: boolean
 *         megaMenu:
 *           type: boolean
 *         icon:
 *           type: string
 *         ordre:
 *           type: number
 *         priorite:
 *           type: number
 *         path:
 *           type: string
 *         typeAffichage:
 *           type: string
 *           enum: "code_13884, code_13883, code_2021, code_187, code_13926, code_13927, "
 *         showAll:
 *           type: boolean
 *         nbrElement:
 *           type: number
 *         typeSelect:
 *           type: string
 *           enum: "code_13897, code_13898, code_13899, code_13900, code_13901, "
 *         typeActivation:
 *           type: string
 *           enum: "code_1960, code_1962, code_1963"
 *         periodeActivation:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dateDebut:
 *                 type: string
 *               dateFin:
 *                 type: string
 *         periodiciteActivation:
 *           type: object
 *         elementAffiche:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         menuParent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/menu'
 *         menuAssocies:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/menu'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to menu
 *         menuPrincipal:
 *           type: boolean
 *         actif:
 *           type: boolean
 *         serviceConfig:
 *           type: object
 *           properties:
 *             service:
 *               type: string
 *             classe:
 *               type: string
 *             option:
 *               type: object
 *         type:
 *           type: string
 *           enum: "code_13934, code_5041, code_13994"
 */
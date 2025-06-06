/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         reference:
 *           type: string
 *         pseudo:
 *           type: string
 *         email:
 *           type: string
 *         pwCrypte:
 *           type: string
 *         salutation:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *         fonction:
 *           type: string
 *         photo:
 *           type: string
 *         telephone:
 *           type: string
 *         fixe:
 *           type: string
 *         nbreConnection:
 *           type: number
 *         dateDerniereConnexion:
 *           type: string
 *         etatCompte:
 *           type: string
 *         etatObjet:
 *           type: string
 *         groupe:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/group'
 *         historiqueConnexion:
 *           type: array
 *           items:
 *             type: object
 *     userCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         pseudo:
 *           type: string
 *           description: Unique constraint
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         pwCrypte:
 *           type: string
 *         salutation:
 *           type: string
 *           enum: "code_1232, code_1233"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *         fonction:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         photo:
 *           type: string
 *           format: binary
 *         telephone:
 *           type: string
 *         fixe:
 *           type: string
 *         nbreConnection:
 *           type: number
 *         dateDerniereConnexion:
 *           type: string
 *           format: date
 *         etatCompte:
 *           type: string
 *           enum: "code_10577, code_4316, code_4317, code_226"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         groupe:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to group
 *         historiqueConnexion:
 *           type: array
 *           items:
 *             type: object
 *       required: ["reference", "pseudo", "email", "pwCrypte", "salutation", "fonction", "telephone", "etatCompte", "groupe"]
 *     userUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         pseudo:
 *           type: string
 *           description: Unique constraint
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         pwCrypte:
 *           type: string
 *         salutation:
 *           type: string
 *           enum: "code_1232, code_1233"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *         fonction:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         photo:
 *           oneOf:
 *             - type: string
 *             - type: string
 *               format: binary
 *         telephone:
 *           type: string
 *         fixe:
 *           type: string
 *         nbreConnection:
 *           type: number
 *         dateDerniereConnexion:
 *           type: string
 *           format: date
 *         etatCompte:
 *           type: string
 *           enum: "code_10577, code_4316, code_4317, code_226"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         groupe:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to group
 *         historiqueConnexion:
 *           type: array
 *           items:
 *             type: object
 *       required: ["reference", "pseudo", "email", "pwCrypte", "salutation", "fonction", "telephone", "etatCompte", "groupe"]
 *     userTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *       required: ["language", "nom", "prenom"]
 *     userGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         pseudo:
 *           type: string
 *           description: Unique constraint
 *         email:
 *           type: string
 *           description: Unique constraint
 *         pwCrypte:
 *           type: string
 *         salutation:
 *           type: string
 *           enum: "code_1232, code_1233"
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *         fonction:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         photo:
 *           type: string
 *         telephone:
 *           type: string
 *         fixe:
 *           type: string
 *         nbreConnection:
 *           type: number
 *         dateDerniereConnexion:
 *           type: string
 *         etatCompte:
 *           type: string
 *           enum: "code_10577, code_4316, code_4317, code_226"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         groupe:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/group'
 *         historiqueConnexion:
 *           type: array
 *           items:
 *             type: object
 */
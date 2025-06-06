/**
 * @swagger
 * components:
 *   schemas:
 *     enumeration:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         code:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             valeur:
 *               type: string
 *             commentaire:
 *               type: string
 *         etatValidation:
 *           type: string
 *     enumerationCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             valeur:
 *               type: string
 *             commentaire:
 *               type: string
 *         etatValidation:
 *           type: string
 *           enum: "code_223, code_4268, code_1407, code_1809"
 *       required: ["code", "etatValidation"]
 *     enumerationUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             valeur:
 *               type: string
 *             commentaire:
 *               type: string
 *         etatValidation:
 *           type: string
 *           enum: "code_223, code_4268, code_1407, code_1809"
 *       required: ["code", "etatValidation"]
 *     enumerationTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         valeur:
 *           type: string
 *         commentaire:
 *           type: string
 *       required: ["language", "valeur"]
 *     enumerationGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               valeur:
 *                 type: string
 *               commentaire:
 *                 type: string
 *         etatValidation:
 *           type: string
 *           enum: "code_223, code_4268, code_1407, code_1809"
 */
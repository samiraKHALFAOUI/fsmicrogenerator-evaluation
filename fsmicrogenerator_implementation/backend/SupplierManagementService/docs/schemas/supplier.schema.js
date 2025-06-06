/**
 * @swagger
 * components:
 *   schemas:
 *     supplier:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         logo:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         email:
 *           type: string
 *         officePhoneNumber:
 *           type: string
 *         isActif:
 *           type: boolean
 *         purchases:
 *           type: array
 *           items:
 *             type: string
 *         products:
 *           type: array
 *           items:
 *             type: string
 *     supplierCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         logo:
 *           type: string
 *           format: binary
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         officePhoneNumber:
 *           type: string
 *           description: Unique constraint
 *         isActif:
 *           type: boolean
 *           default: "true"
 *         purchases:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["email", "officePhoneNumber"]
 *     supplierUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         logo:
 *           oneOf:
 *             - type: string
 *             - type: string
 *               format: binary
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         officePhoneNumber:
 *           type: string
 *           description: Unique constraint
 *         isActif:
 *           type: boolean
 *           default: "true"
 *         purchases:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["email", "officePhoneNumber"]
 *     supplierTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *       required: ["language", "name", "address"]
 *     supplierGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         logo:
 *           type: string
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *         email:
 *           type: string
 *           description: Unique constraint
 *         officePhoneNumber:
 *           type: string
 *           description: Unique constraint
 *         isActif:
 *           type: boolean
 *           default: "true"
 *         purchases:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 */
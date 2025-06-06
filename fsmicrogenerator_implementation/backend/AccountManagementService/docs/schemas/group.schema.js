/**
 * @swagger
 * components:
 *   schemas:
 *     group:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         etatUtilisation:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             designation:
 *               type: string
 *         espaces:
 *           type: array
 *           items:
 *             type: object
 *         users:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/user'
 *         superGroup:
 *           type: boolean
 *     groupCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         etatUtilisation:
 *           type: string
 *           enum: "code_4316, code_4317"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             designation:
 *               type: string
 *         espaces:
 *           type: array
 *           items:
 *             type: object
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to user
 *         superGroup:
 *           type: boolean
 *           default: false
 *       required: ["espaces"]
 *     groupUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         etatUtilisation:
 *           type: string
 *           enum: "code_4316, code_4317"
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             designation:
 *               type: string
 *         espaces:
 *           type: array
 *           items:
 *             type: object
 *         users:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to user
 *         superGroup:
 *           type: boolean
 *           default: false
 *       required: ["espaces"]
 *     groupTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         designation:
 *           type: string
 *       required: ["language", "designation"]
 *     groupGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         etatUtilisation:
 *           type: string
 *           enum: "code_4316, code_4317"
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               designation:
 *                 type: string
 *         espaces:
 *           type: array
 *           items:
 *             type: object
 *         users:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/user'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to user
 *         superGroup:
 *           type: boolean
 *           default: false
 */
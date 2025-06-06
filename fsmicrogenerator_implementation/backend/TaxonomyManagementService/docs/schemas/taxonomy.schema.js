/**
 * @swagger
 * components:
 *   schemas:
 *     taxonomy:
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
 *             designation:
 *               type: string
 *             description:
 *               type: string
 *         domain:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/domain'
 *         parent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/taxonomy'
 *         children:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/taxonomy'
 *     taxonomyCreate:
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
 *             designation:
 *               type: string
 *             description:
 *               type: string
 *         domain:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         parent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *         children:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *     taxonomyUpdate:
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
 *             designation:
 *               type: string
 *             description:
 *               type: string
 *         domain:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         parent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *         children:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *     taxonomyTranslate:
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
 *         description:
 *           type: string
 *       required: ["language", "designation"]
 *     taxonomyGetTranslations:
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
 *               designation:
 *                 type: string
 *               description:
 *                 type: string
 *         domain:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/domain'
 *         parent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/taxonomy'
 *         children:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/taxonomy'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 */
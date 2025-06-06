/**
 * @swagger
 * components:
 *   schemas:
 *     domain:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         code:
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
 *         hasTaxonomies:
 *           type: boolean
 *         parent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/domain'
 *         children:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/domain'
 *         taxonomies:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/taxonomy'
 *     domainCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
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
 *         hasTaxonomies:
 *           type: boolean
 *         parent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         children:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         taxonomies:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *       required: ["code"]
 *     domainUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
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
 *         hasTaxonomies:
 *           type: boolean
 *         parent:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         children:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         taxonomies:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 *       required: ["code"]
 *     domainTranslate:
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
 *     domainGetTranslations:
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
 *         hasTaxonomies:
 *           type: boolean
 *         parent:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/domain'
 *         children:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/domain'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to domain
 *         taxonomies:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/taxonomy'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to taxonomy
 */
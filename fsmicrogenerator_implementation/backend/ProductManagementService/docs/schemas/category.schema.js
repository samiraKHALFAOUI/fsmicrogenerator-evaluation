/**
 * @swagger
 * components:
 *   schemas:
 *     category:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         icon:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *         products:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/product'
 *         parentCategory:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/category'
 *         subCategories:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/category'
 *     categoryCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         icon:
 *           type: string
 *           format: binary
 *           default: null
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to product
 *         parentCategory:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *     categoryUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         icon:
 *           oneOf:
 *             - type: string
 *             - type: string
 *               format: binary
 *           default: null
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to product
 *         parentCategory:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *         subCategories:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *     categoryTranslate:
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
 *       required: ["language", "name"]
 *     categoryGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         icon:
 *           type: string
 *           default: null
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               name:
 *                 type: string
 *         products:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/product'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to product
 *         parentCategory:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/category'
 *         subCategories:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/category'
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     product:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         reference:
 *           type: string
 *         category:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/category'
 *         image:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             description:
 *               type: string
 *         salePrice:
 *           type: number
 *         currency:
 *           type: string
 *         stockQuantity:
 *           type: number
 *         unit:
 *           type: string
 *         status:
 *           type: string
 *         supplier:
 *           type: string
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *         inventoryMovements:
 *           type: array
 *           items:
 *             type: string
 *     productCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         category:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *         image:
 *           type: string
 *           format: binary
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             description:
 *               type: string
 *         salePrice:
 *           type: number
 *         currency:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         stockQuantity:
 *           type: number
 *         unit:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         status:
 *           type: string
 *           enum: "code_18398, code_18399, code_18400"
 *         supplier:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         inventoryMovements:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["reference", "status", "supplier"]
 *     productUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         category:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to category
 *         image:
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
 *             description:
 *               type: string
 *         salePrice:
 *           type: number
 *         currency:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         stockQuantity:
 *           type: number
 *         unit:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         status:
 *           type: string
 *           enum: "code_18398, code_18399, code_18400"
 *         supplier:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         inventoryMovements:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["reference", "status", "supplier"]
 *     productTranslate:
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
 *         description:
 *           type: string
 *       required: ["language", "name"]
 *     productGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         category:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/category'
 *         image:
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
 *               description:
 *                 type: string
 *         salePrice:
 *           type: number
 *         currency:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         stockQuantity:
 *           type: number
 *         unit:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         status:
 *           type: string
 *           enum: "code_18398, code_18399, code_18400"
 *         supplier:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         inventoryMovements:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 */
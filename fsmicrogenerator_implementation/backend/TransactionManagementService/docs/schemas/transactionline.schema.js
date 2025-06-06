/**
 * @swagger
 * components:
 *   schemas:
 *     transactionLine:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         product:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *         transaction:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/transaction'
 *         inventoryMovement:
 *           type: array
 *           items:
 *             type: string
 *     transactionLineCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         product:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transaction:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to transaction
 *         inventoryMovement:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["product", "quantity", "price", "currency", "transaction"]
 *     transactionLineUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         product:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transaction:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to transaction
 *         inventoryMovement:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["product", "quantity", "price", "currency", "transaction"]
 */
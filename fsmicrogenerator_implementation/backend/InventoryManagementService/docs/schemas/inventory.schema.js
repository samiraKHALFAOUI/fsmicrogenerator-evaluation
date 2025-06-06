/**
 * @swagger
 * components:
 *   schemas:
 *     inventory:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         product:
 *           type: string
 *         type:
 *           type: string
 *         raison:
 *           type: string
 *         date:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         transactionLine:
 *           type: string
 *     inventoryCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         product:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         type:
 *           type: string
 *           enum: "code_18416, code_18417"
 *         raison:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         transactionLine:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["product", "type", "raison", "date", "price", "transactionLine"]
 *     inventoryUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         product:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         type:
 *           type: string
 *           enum: "code_18416, code_18417"
 *         raison:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         transactionLine:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["product", "type", "raison", "date", "price", "transactionLine"]
 */
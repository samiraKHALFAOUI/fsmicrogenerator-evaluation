/**
 * @swagger
 * components:
 *   schemas:
 *     transaction:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         reference:
 *           type: string
 *         type:
 *           type: string
 *         registrationDate:
 *           type: string
 *         status:
 *           type: string
 *         savedBy:
 *           type: string
 *         transactionLines:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/transactionLine'
 *         supplier:
 *           type: string
 *         customer:
 *           type: string
 *     transactionCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         type:
 *           type: string
 *           enum: "code_18440, code_18441"
 *         registrationDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: "code_1166, code_1167, code_18436, code_18437, code_18438, code_18439"
 *         savedBy:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to transactionLine
 *         supplier:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         customer:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["reference", "type", "registrationDate", "status", "savedBy"]
 *     transactionUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         reference:
 *           type: string
 *           description: Unique constraint
 *         type:
 *           type: string
 *           enum: "code_18440, code_18441"
 *         registrationDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: "code_1166, code_1167, code_18436, code_18437, code_18438, code_18439"
 *         savedBy:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         transactionLines:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to transactionLine
 *         supplier:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         customer:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["reference", "type", "registrationDate", "status", "savedBy"]
 */
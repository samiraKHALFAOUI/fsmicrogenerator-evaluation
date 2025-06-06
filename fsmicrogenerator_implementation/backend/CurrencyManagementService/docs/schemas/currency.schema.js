/**
 * @swagger
 * components:
 *   schemas:
 *     currency:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         currency:
 *           type: string
 *         typeCurrency:
 *           type: string
 *         symbolCurrency:
 *           type: string
 *         exchangeRates:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/exchangeRate'
 *     currencyCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         currency:
 *           type: string
 *           description: Unique constraint
 *         typeCurrency:
 *           type: string
 *           enum: "code_3630, code_3631"
 *         symbolCurrency:
 *           type: string
 *         exchangeRates:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to exchangeRate
 *       required: ["currency", "typeCurrency"]
 *     currencyUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         currency:
 *           type: string
 *           description: Unique constraint
 *         typeCurrency:
 *           type: string
 *           enum: "code_3630, code_3631"
 *         symbolCurrency:
 *           type: string
 *         exchangeRates:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to exchangeRate
 *       required: ["currency", "typeCurrency"]
 */
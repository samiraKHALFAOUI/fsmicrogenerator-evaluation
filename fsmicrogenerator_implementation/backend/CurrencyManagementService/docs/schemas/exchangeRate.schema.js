/**
 * @swagger
 * components:
 *   schemas:
 *     exchangeRate:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         date:
 *           type: string
 *         refCurrencyBase:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/currency'
 *         refCurrencyEtrangere:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/currency'
 *         valeurAchat:
 *           type: number
 *         valeurVente:
 *           type: number
 *         actif:
 *           type: boolean
 *         currency:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - $ref: '#/components/schemas/currency'
 *     exchangeRateCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         date:
 *           type: string
 *           format: date
 *         refCurrencyBase:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *         refCurrencyEtrangere:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *         valeurAchat:
 *           type: number
 *         valeurVente:
 *           type: number
 *         actif:
 *           type: boolean
 *         currency:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *       required: ["refCurrencyBase", "refCurrencyEtrangere"]
 *     exchangeRateUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         date:
 *           type: string
 *           format: date
 *         refCurrencyBase:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *         refCurrencyEtrangere:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *         valeurAchat:
 *           type: number
 *         valeurVente:
 *           type: number
 *         actif:
 *           type: boolean
 *         currency:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: Reference to currency
 *       required: ["refCurrencyBase", "refCurrencyEtrangere"]
 */
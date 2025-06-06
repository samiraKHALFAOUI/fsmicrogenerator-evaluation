/**
 * @swagger
 * components:
 *   schemas:
 *     langueSite:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         code:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             value:
 *               type: string
 *             commentaire:
 *               type: string
 *         flag:
 *           type: string
 *         actif:
 *           type: boolean
 *         ordreAffichage:
 *           type: number
 *         langueParDefault:
 *           type: boolean
 *     langueSiteCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             value:
 *               type: string
 *             commentaire:
 *               type: string
 *         flag:
 *           type: string
 *         actif:
 *           type: boolean
 *         ordreAffichage:
 *           type: number
 *         langueParDefault:
 *           type: boolean
 *       required: ["code", "actif", "ordreAffichage", "langueParDefault"]
 *     langueSiteUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         code:
 *           type: string
 *           description: Unique constraint
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             value:
 *               type: string
 *             commentaire:
 *               type: string
 *         flag:
 *           type: string
 *         actif:
 *           type: boolean
 *         ordreAffichage:
 *           type: number
 *         langueParDefault:
 *           type: boolean
 *       required: ["code", "actif", "ordreAffichage", "langueParDefault"]
 *     langueSiteTranslate:
 *       type: object
 *       description: Schema used to translate an object (PATCH /:id/translate)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         language:
 *           type: string
 *         value:
 *           type: string
 *         commentaire:
 *           type: string
 *       required: ["language", "value"]
 *     langueSiteGetTranslations:
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
 *         translations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               value:
 *                 type: string
 *               commentaire:
 *                 type: string
 *         flag:
 *           type: string
 *         actif:
 *           type: boolean
 *         ordreAffichage:
 *           type: number
 *         langueParDefault:
 *           type: boolean
 */
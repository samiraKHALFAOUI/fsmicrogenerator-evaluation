/**
 * @swagger
 * components:
 *   schemas:
 *     customer:
 *       type: object
 *       description: Schema used for retrieving objects (GET)
 *       properties:
 *         _id:
 *           type: string
 *         etatObjet:
 *           type: string
 *         photo:
 *           type: string
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *     customerCreate:
 *       type: object
 *       description: Schema used when creating new objects (POST)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         photo:
 *           type: string
 *           format: binary
 *         translations:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         phoneNumber:
 *           type: string
 *           description: Unique constraint
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["email", "phoneNumber"]
 *     customerUpdate:
 *       type: object
 *       description: Schema used when updating existing objects (PATCH/PUT)
 *       properties:
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         photo:
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
 *             address:
 *               type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Unique constraint
 *         phoneNumber:
 *           type: string
 *           description: Unique constraint
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 *       required: ["email", "phoneNumber"]
 *     customerTranslate:
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
 *         address:
 *           type: string
 *       required: ["language", "name"]
 *     customerGetTranslations:
 *       type: object
 *       description: Schema used to retrieve all translations (GET /translations)
 *       properties:
 *         _id:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *         etatObjet:
 *           type: string
 *           default: "code-1"
 *         photo:
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
 *               address:
 *                 type: string
 *         email:
 *           type: string
 *           description: Unique constraint
 *         phoneNumber:
 *           type: string
 *           description: Unique constraint
 *         orders:
 *           type: array
 *           items:
 *             type: string
 *           pattern: "^[a-f\\d]{24}$"
 */
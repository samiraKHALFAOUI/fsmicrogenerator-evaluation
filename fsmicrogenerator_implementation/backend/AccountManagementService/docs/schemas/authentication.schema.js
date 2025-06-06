/**
 * @swagger
 * components:
 *   schemas:
 *     login:
 *       type: object
 *       description: Schema used for login
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       required: ["email", "password"]
 *     logout:
 *       type: object
 *       description: Schema used for logout
 *       properties:
 *         user:
 *           type: string
 *           pattern: "^[a-f\\d]{24}$"
 *           description: user id
 *         motif:
 *           type: string
 *           description: logout raison (session expired, user logout)
 *       required: ["language", "nom", "prenom"]
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     register:
 *       type: object
 *       required:
 *         - serviceName
 *         - protocol
 *         - host
 *         - port
 *         - role
 *       properties:
 *         serviceName:
 *           type: string
 *         protocol:
 *           type: string
 *         host:
 *           type: string
 *         port:
 *           type: number
 *         role:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - authentication
 *               - authorization

 *     unregister:
 *       type: object
 *       required:
 *         - serviceName
 *         - url
 *       properties:
 *         serviceName:
 *           type: string
 *         url:
 *           type: string

 *     updateState:
 *       type: object
 *       required:
 *         - serviceName
 *         - url
 *         - status
 *       properties:
 *         serviceName:
 *           type: string
 *         url:
 *           type: string
 *         status:
 *           type: string
 */

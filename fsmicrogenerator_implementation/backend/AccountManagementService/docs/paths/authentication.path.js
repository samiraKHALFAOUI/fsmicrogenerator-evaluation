
/**
 * @swagger
 * tags:
 *   - name: authentication
 *     description: REST API endpoints to manage authentication resources.
 */

/**
 * @swagger
 * /authentication:
 *   post:
 *     tags: [authentication]
 *     summary: User login
 *     description: Authenticates a user using email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: Login successful, returns user info and token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/user'
 *                 expiresIn:
 *                   type: number
 *                   description: Timestamp of expiration in ms
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       406:
 *         description: Disabled account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request or server error
 *
 * /authentication/token:
 *   get:
 *     tags: [authentication]
 *     summary: Regenerate JWT token
 *     description: Generates a new token using the old one (sent in header)
 *     parameters:
 *       - name: jwt
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: Old JWT token
 *     responses:
 *       200:
 *         description: Token regenerated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expiresIn:
 *                   type: number
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid token or request
 *
 * /authentication/logout:
 *   post:
 *     tags: [authentication]
 *     summary: Logout user
 *     description: Logs out a user and updates logout history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/logout'
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Updated user document
 *       400:
 *         description: Error during logout
 */

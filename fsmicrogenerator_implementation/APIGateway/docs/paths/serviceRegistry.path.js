/**
 * @swagger
 * tags:
 *   - name: serviceRegistry
 *     description: REST API endpoints to manage service registry instances.
 */

/**
 * @swagger
 * /registries/register:
 *   post:
 *     tags: [serviceRegistry]
 *     summary: Register a new service instance or re-enable an existing one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/register'
 *     responses:
 *       '200':
 *         description: Service registered or already exists
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             examples:
 *               registered:
 *                 summary: New registration
 *                 value: Successfully registered my-service
 *               exists:
 *                 summary: Already exists
 *                 value: Configuration already exists for my-service at http://localhost:3000/
 *       '400':
 *         description: Registration error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Register error: <error message>
 */

/**
 * @swagger
 * /registries/unregister:
 *   post:
 *     tags: [serviceRegistry]
 *     summary: Unregister an existing service instance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/unregister'
 *     responses:
 *       '200':
 *         description: Service successfully unregistered
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: Successfully unregistered my-service
 *       '404':
 *         description: Service not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               No my-service was registered at http://localhost:3000/
 *       '400':
 *         description: Unregistration error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Unregister error: <error message>
 */

/**
 * @swagger
 * /registries/updateState:
 *   post:
 *     tags: [serviceRegistry]
 *     summary: Update the status of a service instance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateState'
 *     responses:
 *       '200':
 *         description: State updated successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: Successfully updated my-service instance status
 *       '404':
 *         description: Instance not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Unable to update state: no my-service registered at http://localhost:3000/
 *       '400':
 *         description: Update error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Update state error: <error message>
 */

/**
 * @swagger
 * tags:
 *   - name: monitoring
 *     description: Endpoints for CustomerManagement status and monitoring
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [monitoring]
 *     summary: Health check of CustomerManagement and its dependencies
 *     responses:
 *       '200':
 *         description: All dependencies are connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: CustomerManagementService
 *                 mongo:
 *                   type: string
 *                   example: CONNECTED
 *                 redis:
 *                   type: string
 *                   example: CONNECTED
 *       '500':
 *         description: One or more dependencies are not connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   type: string
 *                   example: CustomerManagementService
 *                 mongo:
 *                   type: string
 *                   enum: [CONNECTED, DISCONNECTED]
 *                   description: MongoDB connection status
 *                 redis:
 *                   type: string
 *                   enum: [CONNECTED, DISCONNECTED]
 *                   description: Redis connection status
 *                 rabbitmq:
 *                   type: string
 *                   enum: [DISCONNECTED, CONNECTED]
 *                   description: Redis connection status
 *                 error:
 *                   type: string
 *                   example: One or more dependencies are not connected
 */

/**
 * @swagger
 * /metrics:
 *   get:
 *     tags: [monitoring]
 *     summary: Exposes Prometheus metrics for monitoring
 *     responses:
 *       '200':
 *         description: Prometheus metrics in plain text format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: |
 *                 # HELP http_requests_total The total number of HTTP requests.
 *                 # TYPE http_requests_total counter
 *                 http_requests_total{method="get",code="200"} 1027
 */

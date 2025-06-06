
/**
 * @swagger
 * tags:
 *   - name: exchangeRate
 *     description: REST API endpoints to manage exchangeRate resources.
 */

/**
 * @swagger
 * /exchangeRates/:
 *   get:
 *     tags: [exchangeRate]
 *     summary: Retrieve all exchangeRates with state (etatObjet) = 'code-1'
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: List of exchangeRate
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/exchangeRate'
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   post:
 *     tags: [exchangeRate]
 *     summary: Create a new exchangeRate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/exchangeRateCreate'
 *     responses:
 *       '201':
 *         description: Document created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exchangeRate'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [exchangeRate]
 *     summary: Archive or activate many exchangeRate based on their ids
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               etat:
 *                 type: string
 *                 enum: ['code-1', 'code-2']
 *     responses:
 *       '200': { $ref: '#/components/responses/StateUpdated' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /exchangeRates/many:
 *   post:
 *     tags: [exchangeRate]
 *     summary: Insert multiple exchangeRate documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/exchangeRateCreate'
 *     responses:
 *       '201':
 *         description: Multiple documents inserted successfully
 *         content:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/exchangeRate'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [exchangeRate]
 *     summary: Update many exchangeRates using ids and a patch object
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: "^[a-f\\d]{24}$"
 *                   description: MongoDB ObjectId
 *               data:
 *                 type: object
 *                 description: Fields to update for the selected documents
 *     responses:
 *       '200': { $ref: '#/components/responses/UpdatedMany' }
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'
 */


/**
 * @swagger
 * /exchangeRates/one:
 *   get:
 *     tags: [exchangeRate]
 *     summary: Retrieve a exchangeRate using a custom condition (sent in query)
 *     parameters:
 *       - name: condition
 *         in: query
 *         required: true
 *         description: JSON string of condition to apply to findOne
 *         schema:
 *           type: string
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single exchangeRate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exchangeRate'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /exchangeRates/statistiques:
 *   post:
 *     tags: [exchangeRate]
 *     summary: Run custom aggregation pipeline on exchangeRates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: MongoDB aggregation pipeline or config object
 *     responses:
 *       '200': { $ref: '#/components/responses/SuccessObject' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /exchangeRates/{id}:
 *   get:
 *     tags: [exchangeRate]
 *     summary: Retrieve a exchangeRate by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single exchangeRate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/exchangeRate'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [exchangeRate]
 *     summary: update a exchangeRate by ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/exchangeRateUpdate'
 *     responses:
 *       '200': 
 *          description: Document updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Data updated successfully
 *                  data:
 *                    schema: 
 *                      $ref: '#/components/schemas/exchangeRate'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'
 */

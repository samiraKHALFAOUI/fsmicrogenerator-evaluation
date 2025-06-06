
/**
 * @swagger
 * tags:
 *   - name: currency
 *     description: REST API endpoints to manage currency resources.
 */

/**
 * @swagger
 * /currencies/:
 *   get:
 *     tags: [currency]
 *     summary: Retrieve all currencies with state (etatObjet) = 'code-1'
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: List of currency
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/currency'
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   post:
 *     tags: [currency]
 *     summary: Create a new currency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/currencyCreate'
 *     responses:
 *       '201':
 *         description: Document created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/currency'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [currency]
 *     summary: Archive or activate many currency based on their ids
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
 * /currencies/many:
 *   post:
 *     tags: [currency]
 *     summary: Insert multiple currency documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/currencyCreate'
 *     responses:
 *       '201':
 *         description: Multiple documents inserted successfully
 *         content:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/currency'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [currency]
 *     summary: Update many currencies using ids and a patch object
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
 * /currencies/one:
 *   get:
 *     tags: [currency]
 *     summary: Retrieve a currency using a custom condition (sent in query)
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
 *         description: Single currency
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/currency'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /currencies/statistiques:
 *   post:
 *     tags: [currency]
 *     summary: Run custom aggregation pipeline on currencies
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
 * /currencies/{id}:
 *   get:
 *     tags: [currency]
 *     summary: Retrieve a currency by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single currency
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/currency'
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
 *     tags: [currency]
 *     summary: update a currency by ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/currencyUpdate'
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
 *                      $ref: '#/components/schemas/currency'
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

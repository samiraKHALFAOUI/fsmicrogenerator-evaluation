
/**
 * @swagger
 * tags:
 *   - name: langueSite
 *     description: REST API endpoints to manage langueSite resources.
 */

/**
 * @swagger
 * /langueSites/:
 *   get:
 *     tags: [langueSite]
 *     summary: Retrieve all langueSites with state (etatObjet) = 'code-1'
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: List of langueSite
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/langueSite'
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   post:
 *     tags: [langueSite]
 *     summary: Create a new langueSite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/langueSiteCreate'
 *     responses:
 *       '201':
 *         description: Document created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/langueSite'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [langueSite]
 *     summary: Archive or activate many langueSite based on their ids
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
 * /langueSites/many:
 *   post:
 *     tags: [langueSite]
 *     summary: Insert multiple langueSite documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/langueSiteCreate'
 *     responses:
 *       '201':
 *         description: Multiple documents inserted successfully
 *         content:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/langueSite'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [langueSite]
 *     summary: Update many langueSites using ids and a patch object
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
 * /langueSites/translate/{id}:
 *   get:
 *     tags: [langueSite]
 *     summary: Get all translations of a specific langueSite
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/langueSiteGetTranslations'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   patch:
 *     tags: [langueSite]
 *     summary: Update or add a translation for a langueSite
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/langueSiteTranslate'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/langueSiteGetTranslations'
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

/**
 * @swagger
 * /langueSites/one:
 *   get:
 *     tags: [langueSite]
 *     summary: Retrieve a langueSite using a custom condition (sent in query)
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
 *         description: Single langueSite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/langueSite'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /langueSites/statistiques:
 *   post:
 *     tags: [langueSite]
 *     summary: Run custom aggregation pipeline on langueSites
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
 * /langueSites/{id}:
 *   get:
 *     tags: [langueSite]
 *     summary: Retrieve a langueSite by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single langueSite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/langueSite'
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
 *     tags: [langueSite]
 *     summary: update a langueSite by ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/langueSiteUpdate'
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
 *                      $ref: '#/components/schemas/langueSite'
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

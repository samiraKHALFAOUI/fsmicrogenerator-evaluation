
/**
 * @swagger
 * tags:
 *   - name: domain
 *     description: REST API endpoints to manage domain resources.
 */

/**
 * @swagger
 * /domains/:
 *   get:
 *     tags: [domain]
 *     summary: Retrieve all domains with state (etatObjet) = 'code-1'
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: List of domain
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/domain'
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   post:
 *     tags: [domain]
 *     summary: Create a new domain (with file upload)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/domainCreate'
 *     responses:
 *       '201':
 *         description: Document created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/domain'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [domain]
 *     summary: Archive or activate many domain based on their ids
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
 * /domains/many:
 *   post:
 *     tags: [domain]
 *     summary: Insert multiple domain documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/domainCreate'
 *     responses:
 *       '201':
 *         description: Multiple documents inserted successfully
 *         content:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/domain'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [domain]
 *     summary: Update many domains using ids and a patch object
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
 * /domains/translate/{id}:
 *   get:
 *     tags: [domain]
 *     summary: Get all translations of a specific domain
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/domainGetTranslations'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   patch:
 *     tags: [domain]
 *     summary: Update or add a translation for a domain
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/domainTranslate'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/domainGetTranslations'
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
 * /domains/one:
 *   get:
 *     tags: [domain]
 *     summary: Retrieve a domain using a custom condition (sent in query)
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
 *         description: Single domain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/domain'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /domains/statistiques:
 *   post:
 *     tags: [domain]
 *     summary: Run custom aggregation pipeline on domains
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
 * /domains/{id}:
 *   get:
 *     tags: [domain]
 *     summary: Retrieve a domain by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single domain
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/domain'
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
 *     tags: [domain]
 *     summary: update a domain by ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/domainUpdate'
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
 *                      $ref: '#/components/schemas/domain'
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

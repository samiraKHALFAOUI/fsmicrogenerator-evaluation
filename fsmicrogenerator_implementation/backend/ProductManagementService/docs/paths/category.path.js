
/**
 * @swagger
 * tags:
 *   - name: category
 *     description: REST API endpoints to manage category resources.
 */

/**
 * @swagger
 * /categories/:
 *   get:
 *     tags: [category]
 *     summary: Retrieve all categories with state (etatObjet) = 'code-1'
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: List of category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/category'
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   post:
 *     tags: [category]
 *     summary: Create a new category (with file upload)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/categoryCreate'
 *     responses:
 *       '201':
 *         description: Document created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/category'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [category]
 *     summary: Archive or activate many category based on their ids
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
 * /categories/many:
 *   post:
 *     tags: [category]
 *     summary: Insert multiple category documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/categoryCreate'
 *     responses:
 *       '201':
 *         description: Multiple documents inserted successfully
 *         content:
 *           application/json:
 *             type: array
 *             schema:
 *               $ref: '#/components/schemas/category'
 *       '400':
 *         description: Bad request or application error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/responses/BadRequest'
 *                 - $ref: '#/components/responses/ApplicationError'

 *   patch:
 *     tags: [category]
 *     summary: Update many categories using ids and a patch object
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
 * /categories/translate/{id}:
 *   get:
 *     tags: [category]
 *     summary: Get all translations of a specific category
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoryGetTranslations'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }

 *   patch:
 *     tags: [category]
 *     summary: Update or add a translation for a category
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/categoryTranslate'
 *     responses:
 *       '200':
 *         description: object to translate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoryGetTranslations'
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
 * /categories/one:
 *   get:
 *     tags: [category]
 *     summary: Retrieve a category using a custom condition (sent in query)
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
 *         description: Single category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/category'
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '400': { $ref: '#/components/responses/ApplicationError' }
 */

/**
 * @swagger
 * /categories/statistiques:
 *   post:
 *     tags: [category]
 *     summary: Run custom aggregation pipeline on categories
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
 * /categories/{id}:
 *   get:
 *     tags: [category]
 *     summary: Retrieve a category by its ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *       - $ref: '#/components/parameters/ProjectionParam'
 *       - $ref: '#/components/parameters/QueryOptionsParam'
 *     responses:
 *       '200':
 *         description: Single category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/category'
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
 *     tags: [category]
 *     summary: update a category by ID
 *     parameters:
 *       - $ref: '#/components/parameters/DocId'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/categoryUpdate'
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
 *                      $ref: '#/components/schemas/category'
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

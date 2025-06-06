/**
 * @swagger
 * components:
 *   responses:
 *     SuccessList:
 *       description: Successfully retrieved list of documents
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object

 *     SuccessObject:
 *       description: Successfully retrieved document
 *       content:
 *         application/json:
 *           schema:
 *             type: object

 *     Created:
 *       description: Document saved successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: The newly saved document

 *     CreatedMany:
 *       description: Multiple documents inserted successfully
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: object
 *            description: Each inserted document

 *     Updated:
 *       description: Document updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Data updated successfully
 *               data:
 *                 type: object
 *                 description: The new document after update

 *     UpdatedMany:
 *       description: Multiple documents updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: MongoDB updateMany result object

 *     StateUpdated:
 *       description: State updated successfully for selected documents
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: MongoDB updateMany result object

 *     NotFound:
 *       description: Document not found (ex. non-existing ID)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Data not found

 *     BadRequest:
 *       description: Joi schema validation failed (invalid body data)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid data was provided
 *               errors:
 *                 type: array
 *                 description: List of validation errors
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                       description: Field path (dot notation)
 *                       example: reference
 *                     message:
 *                       type: string
 *                       description: Error message from Joi
 *                       example: reference is required

 *     ApplicationError:
 *       description: Application or database error (logic, insert, update, etc.)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: boolean
 *                 example: true
 *               message:
 *                 type: string
 *                 example: An error occurred while updating data
 *               detail:
 *                 type: string
 *                 example: |
 *                    E11000 duplicate key error index: reference_1 dup key

 *     InternalServerError:
 *       description: Unexpected server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: An unexpected error occurred
 *               error:
 *                 type: string
 *                 example: Stacktrace or error detail (optional)
 */

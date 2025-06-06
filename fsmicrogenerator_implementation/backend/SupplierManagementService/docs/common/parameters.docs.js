/**
 * @swagger
 * components:
 *   parameters:
 *     DocId:
 *       name: id
 *       in: path
 *       required: true
 *       description: MongoDB ObjectId
 *       schema:
 *         type: string
 *         pattern: "^[a-f\\d]{24}$"

 *     ProjectionParam:
 *       name: projection
 *       in: query
 *       required: false
 *       description: |
 *         Specific fields to include or exclude from the response. Two possible formats:
 *         1) Comma-separated list of fields (e.g. 'name,image')
 *         2) JSON Object (e.g. '{"name":1,"image":0}')
 *       schema:
 *         type: string
 *         example: 'name,image'

 *     QueryOptionsParam:
 *       name: queryOptions
 *       in: query
 *       required: false
 *       description: |
 *         JSON string for filtering, sorting, pagination. Keys may include:
 *         - filter (fields to match),
 *         - sort (field or object),
 *         - limit (number),
 *         - page (number)
 *       schema:
 *         type: string
 *         example: '{"etatObjet":"code-1","sort":"createdAt","limit":10,"page":2}'

 *     ConditionParam:
 *       name: condition
 *       in: query
 *       required: true
 *       description: JSON string representing the condition for findOne or filtering
 *       schema:
 *         type: string
 *         example: '{"reference": "PRD-001"}'
 */

/**
 * @swagger
 * tags:
 *   name: Account Aggregator
 *   description: Account Aggregator data management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountAggregatorData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the account aggregator data (same as the user ID)
 *         data:
 *           type: object
 *           description: The JSON data from the account aggregator
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the data was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the data was last updated
 */

/**
 * @swagger
 * /account-aggregator:
 *   post:
 *     summary: Upload account aggregator data as JSON
 *     tags: [Account Aggregator]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any valid JSON object
 *     responses:
 *       200:
 *         description: Account aggregator data stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account aggregator data stored successfully
 *                 id:
 *                   type: string
 *                   example: data123
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get account aggregator data
 *     tags: [Account Aggregator]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account aggregator data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account aggregator data retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/AccountAggregatorData'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No account aggregator data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete account aggregator data
 *     tags: [Account Aggregator]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account aggregator data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account aggregator data deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No account aggregator data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /account-aggregator/upload:
 *   post:
 *     summary: Upload account aggregator data as a file
 *     tags: [Account Aggregator]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JSON file containing account aggregator data
 *     responses:
 *       200:
 *         description: Account aggregator data stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account aggregator data stored successfully
 *                 id:
 *                   type: string
 *                   example: data123
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noFile:
 *                 value:
 *                   error: No file uploaded or file is not a JSON file
 *               invalidJson:
 *                 value:
 *                   error: Invalid JSON file
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

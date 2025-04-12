/**
 * @swagger
 * tags:
 *   name: Experts
 *   description: Expert management and authentication
 */

/**
 * @swagger
 * /experts/signup:
 *   post:
 *     summary: Register a new expert
 *     tags: [Experts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpertSignup'
 *     responses:
 *       201:
 *         description: Expert account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expert account created successfully. You can now log in.
 *                 expertId:
 *                   type: string
 *                   example: expert123
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: Email, password, and name are required
 *               existingExpert:
 *                 value:
 *                   error: Expert with this email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /experts/login:
 *   post:
 *     summary: Authenticate an expert
 *     tags: [Experts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpertLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expert:
 *                   $ref: '#/components/schemas/Expert'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 value:
 *                   error: Email and password are required
 *               invalidCredentials:
 *                 value:
 *                   error: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /experts/profile:
 *   get:
 *     summary: Get expert profile with posts
 *     tags: [Experts]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expert profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expert profile retrieved successfully
 *                 expert:
 *                   $ref: '#/components/schemas/Expert'
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Expert not found
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
 *   put:
 *     summary: Update expert profile
 *     tags: [Experts]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. Jane Smith, PhD
 *               bio:
 *                 type: string
 *                 example: Updated bio with more details about my expertise in retirement planning.
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Financial Planning", "Retirement", "Tax Planning"]
 *               experience:
 *                 type: string
 *                 example: 12+ years in financial advisory
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 expert:
 *                   $ref: '#/components/schemas/Expert'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Bad request
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
 * /experts/verified:
 *   get:
 *     summary: Get all verified experts
 *     tags: [Experts]
 *     responses:
 *       200:
 *         description: Verified experts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verified experts retrieved successfully
 *                 experts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expert'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /experts/specialty/{specialty}:
 *   get:
 *     summary: Get experts by specialty
 *     tags: [Experts]
 *     parameters:
 *       - in: path
 *         name: specialty
 *         schema:
 *           type: string
 *         required: true
 *         description: The specialty to filter experts by
 *     responses:
 *       200:
 *         description: Experts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Experts with specialty 'Retirement' retrieved successfully
 *                 experts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expert'
 *       400:
 *         description: Bad request
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
 * /experts/logout:
 *   post:
 *     summary: Logout expert
 *     tags: [Experts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /experts/check-auth:
 *   get:
 *     summary: Check authentication status
 *     tags: [Experts]
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                       example: true
 *                     user:
 *                       $ref: '#/components/schemas/Expert'
 *                     sessionAge:
 *                       type: integer
 *                       example: 3600
 *                 - type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                       example: false
 *                     reason:
 *                       type: string
 *                       example: no_session_or_not_expert
 */

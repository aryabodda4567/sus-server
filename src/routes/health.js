const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                 dependencies:
 *                   type: object
 *       500:
 *         description: API is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 error:
 *                   type: string
 */
router.get('/', async (req, res) => {
    try {
        // Check Firebase connection
        let firebaseStatus = 'ok';
        let firebaseError = null;
        
        try {
            // Try to access Firestore to verify connection
            const db = admin.firestore();
            const healthCheck = await db.collection('_health_check').doc('status').set({
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            firebaseStatus = 'error';
            firebaseError = error.message;
        }
        
        // Get package version
        const packageJson = require('../../package.json');
        
        // Prepare response
        const healthStatus = {
            status: firebaseStatus === 'ok' ? 'ok' : 'error',
            timestamp: new Date().toISOString(),
            version: packageJson.version || '1.0.0',
            dependencies: {
                firebase: {
                    status: firebaseStatus,
                    error: firebaseError
                }
            }
        };
        
        // Return appropriate status code
        if (healthStatus.status === 'ok') {
            return res.status(200).json(healthStatus);
        } else {
            return res.status(500).json(healthStatus);
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;

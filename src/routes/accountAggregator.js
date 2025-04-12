const express = require('express');
const router = express.Router();
const AccountAggregatorController = require('../controller/accountAggregator');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Upload account aggregator data (file upload)
router.post('/upload', AccountAggregatorController.uploadData);

// Upload account aggregator data (JSON in request body)
router.post('/', AccountAggregatorController.uploadJsonData);

// Get account aggregator data
router.get('/', AccountAggregatorController.getData);

// Delete account aggregator data
router.delete('/', AccountAggregatorController.deleteData);

module.exports = router;

const express = require('express');
const router = express.Router();
const { swaggerUi, swaggerSpec, swaggerUiOptions } = require('../config/swagger');

// Serve Swagger documentation
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Serve Swagger JSON
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = router;

const express = require('express');
const UserController = require('../controller/users');

const router = express.Router();

// Signup route
router.post('/signup', UserController.signup);

// Login route
router.post('/login', UserController.login);

module.exports = router;
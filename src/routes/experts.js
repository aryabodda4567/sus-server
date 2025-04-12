const express = require('express');
const ExpertController = require('../controller/experts');
const { authenticateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Public routes
// Expert signup route
router.post('/signup', ExpertController.signup);

// Expert login route
router.post('/login', ExpertController.login);

// Get all verified experts (public)
router.get('/verified', ExpertController.getVerifiedExperts);

// Get experts by specialty (public)
router.get('/specialty/:specialty', ExpertController.getExpertsBySpecialty);

// Protected routes (require authentication)
// Get expert profile
router.get('/profile', authenticateToken, ExpertController.getProfile);

// Update expert profile
router.put('/profile', authenticateToken, ExpertController.updateProfile);

// Admin routes
// Get all experts (admin only)
router.get('/all', authenticateToken, ExpertController.getAllExperts);

// Verify expert (admin only) - kept for future use if needed
// This endpoint is now optional as experts are automatically verified
router.put('/verify/:expertId', authenticateToken, ExpertController.verifyExpert);

// Logout route
router.post('/logout', (req, res) => {
    // Check if session exists
    if (!req.session) {
        return res.status(200).json({ message: 'Already logged out' });
    }

    // Clear session data first
    req.session.authenticated = false;
    req.session.token = null;
    req.session.user = null;

    // Destroy the session completely
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Failed to logout' });
        }

        // Clear the session cookie
        res.clearCookie('connect.sid');

        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Check if expert is authenticated
router.get('/check-auth', (req, res) => {
    // Check if session exists and user is authenticated
    if (req.session && req.session.authenticated && req.session.user && req.session.user.role === 'expert') {
        // If there's a token, verify it
        if (req.session.token) {
            try {
                // Verify the token is still valid
                jwt.verify(req.session.token, process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file');

                // Update last activity timestamp
                req.session.lastActivity = Date.now();

                return res.status(200).json({
                    authenticated: true,
                    user: req.session.user,
                    sessionAge: Date.now() - (req.session.lastActivity || Date.now())
                });
            } catch (error) {
                console.error('Token verification error in check-auth:', error.message);
                // Token is invalid or expired, destroy session
                req.session.destroy(err => {
                    if (err) console.error('Session destruction error:', err);
                });
                return res.status(200).json({ authenticated: false, reason: 'invalid_token' });
            }
        } else {
            // Session exists without token (unusual but possible)
            return res.status(200).json({
                authenticated: true,
                user: req.session.user,
                note: 'Session without token'
            });
        }
    }

    // No valid session or not an expert
    return res.status(200).json({ authenticated: false, reason: 'no_session_or_not_expert' });
});

module.exports = router;

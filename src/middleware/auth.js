const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file';

/**
 * Authentication middleware to verify JWT tokens and session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  // First check if user is authenticated via session
  if (req.session && req.session.authenticated && req.session.user) {
    // Session exists and user is authenticated
    
    // If there's a token in the session, verify it
    if (req.session.token) {
      try {
        // Verify the token
        const decoded = jwt.verify(req.session.token, JWT_SECRET);
        
        // Add the user data to the request object
        req.user = decoded;
        
        // Update session last activity timestamp
        req.session.lastActivity = Date.now();
        
        // Continue to the next middleware or route handler
        return next();
      } catch (error) {
        console.error('Session token verification error:', error.message);
        // Token is invalid, clear the session
        req.session.destroy((err) => {
          if (err) console.error('Session destruction error:', err);
        });
      }
    } else {
      // Session exists but no token - use session user data
      req.user = req.session.user;
      return next();
    }
  }
  
  // If no valid session, try authorization header
  const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (headerToken) {
    try {
      // Verify the token from header
      const decoded = jwt.verify(headerToken, JWT_SECRET);
      
      // Add the user data to the request object
      req.user = decoded;
      
      // Store in session for future requests
      req.session.authenticated = true;
      req.session.token = headerToken;
      req.session.user = decoded;
      req.session.lastActivity = Date.now();
      
      // Continue to the next middleware or route handler
      return next();
    } catch (error) {
      console.error('Header token verification error:', error.message);
    }
  }
  
  // No valid session or token
  return res.status(401).json({ error: 'Access denied. Please log in.' });
};

module.exports = { authenticateToken };

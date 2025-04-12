const UserModel = require('../model/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file';

const UserController = {
    // Signup
    async signup(req, res) {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const data = req.body


        try {
            // Check if user already exists
            const existingUser = await UserModel.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            data.password =  await bcrypt.hash(password, 10);

            // Create user
            const newUser = await UserModel.insertUser(data);
            if (!newUser.success) {
                return res.status(500).json({ error: 'Failed to create user' });
            }

            return res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            console.error('Signup error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Login
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            console.log('Login attempt for email:', email);

            // Get user by email
            const user = await UserModel.getUserByEmail(email);
            console.log('User found:', user ? 'Yes' : 'No');

            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // Compare passwords
            console.log('Comparing passwords...');
            try {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');

                if (!isPasswordValid) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }
            } catch (bcryptError) {
                console.error('bcrypt comparison error:', bcryptError);
                return res.status(500).json({ error: 'Error validating credentials' });
            }

            // Generate JWT token
            console.log('Generating JWT token...');
            let token;
            try {
                const payload = { user_id: user.id, email: user.email };
                console.log('JWT payload:', payload);
                console.log('Using JWT_SECRET:', JWT_SECRET.substring(0, 3) + '...');

                token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
                console.log('Token generated successfully');
            } catch (jwtError) {
                console.error('JWT generation error:', jwtError);
                return res.status(500).json({ error: 'Error generating authentication token' });
            }

            // Store authentication data in the session
            req.session.authenticated = true;
            req.session.token = token;
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name || '',
                role: user.role || 'user',
                lastLogin: new Date().toISOString()
            };

            // Save the session explicitly
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                } else {
                    console.log('Session saved successfully');
                }
            });

            // Remove sensitive information from user object
            const { password: userPassword, ...userWithoutPassword } = user;

            return res.status(200).json({
                message: 'Login successful',
                token, // Still return the token for clients that might need it
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Login error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = UserController;

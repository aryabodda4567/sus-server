const  express = require('express');
const UserModel= require('../model/users');
const bcrypt = require('bcryptjs');
const User={

    register: async (req, res) => {
        try {
            // Destructure and trim input
            let {
                name,
                email,
                password,
                mobileNumber,
                profession,
                region,
                salary,
                incomeSources,
            } = req.body;

            // Basic sanitization
            name = String(name || '').trim();
            email = String(email || '').trim().toLowerCase();
            password = String(password || '').trim();
            mobileNumber = String(mobileNumber || '').replace(/\D/g, '').trim();
            profession = String(profession || '').trim();
            region = String(region || '').trim();
            salary = parseFloat(salary || 0);
            incomeSources = Array.isArray(incomeSources)
                ? incomeSources.map(src => String(src).trim())
                : [];

            // Check required fields
            if (!name || !email || !password || !mobileNumber) {
                return res.status(400).json({error: 'Missing required fields.'});
            }

            // Check if the user already exists by email
            const existingUser = await UserModel.getUserByEmail(email);

            if (existingUser) {
                return res.status(400).json({error: 'User with this email already exists.'});
            }

            // Hash the password before saving (optional, but recommended)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create sanitized user object
            const userData = {
                name,
                email,
                password: hashedPassword, // Hashed password for security
                mobileNumber,
                profession,
                region,
                salary,
                incomeSources,
                createdAt: new Date(),
            };

            // Insert the user into Firestore
            const userRef = await UserModel.insertUser(userData);

            // Send response with user ID
            res.status(201).json({
                message: 'User successfully registered.',
                userId: userRef.id, // Firestore generated user ID
            });

        } catch (error) {
            console.error('Error in register:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    login: async (req, res) => {
        try {
            let { email, password } = req.body;

            // Basic sanitization
            email = String(email || '').trim().toLowerCase();
            password = String(password || '').trim();

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }

            // Call model function to validate credentials
            const result = await UserModel.validateLogin(email, password);

            if (result.success) {
                return res.status(200).json({
                    login: true,
                    message: 'Login successful',
                    // user: result.user // Optional: return user data if needed
                });
            } else {
                return res.status(401).json({ login: false, error: 'Invalid email or password' });
            }

        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


}





module.exports = User;
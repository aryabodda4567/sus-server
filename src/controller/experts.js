const ExpertModel = require('../model/experts');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_should_be_in_env_file';

const ExpertController = {
    // Expert Signup
    async signup(req, res) {
        const { email, password, name, specialties, experience, qualifications, bio } = req.body;

        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        try {
            // Check if expert already exists
            const existingExpert = await ExpertModel.getExpertByEmail(email);
            if (existingExpert) {
                return res.status(400).json({ error: 'Expert with this email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Prepare expert data
            const expertData = {
                email,
                password: hashedPassword,
                name,
                specialties: specialties || [],
                experience: experience || '',
                qualifications: qualifications || [],
                bio: bio || '',
                createdAt: new Date(),
                role: 'expert',
                isVerified: false,
                status: 'pending'
            };

            // Create expert
            const newExpert = await ExpertModel.insertExpert(expertData);
            if (!newExpert.success) {
                return res.status(500).json({ error: 'Failed to create expert account' });
            }

            return res.status(201).json({
                message: 'Expert account created successfully. You can now log in.',
                expertId: newExpert.id
            });
        } catch (error) {
            console.error('Expert signup error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Expert Login
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            console.log('Expert login attempt for email:', email);

            // Get expert by email
            const expert = await ExpertModel.getExpertByEmail(email);
            console.log('Expert found:', expert ? 'Yes' : 'No');

            if (!expert) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            // No verification check needed as experts are automatically verified
            // We'll keep the isVerified field for future use if needed

            // Compare passwords
            console.log('Comparing passwords...');
            try {
                const isPasswordValid = await bcrypt.compare(password, expert.password);
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
                const payload = {
                    user_id: expert.id,
                    email: expert.email,
                    role: 'expert'
                };
                console.log('JWT payload:', payload);

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
                id: expert.id,
                email: expert.email,
                name: expert.name,
                role: 'expert',
                isVerified: expert.isVerified,
                specialties: expert.specialties,
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

            // Remove sensitive information from expert object
            const { password: expertPassword, ...expertWithoutPassword } = expert;

            return res.status(200).json({
                message: 'Login successful',
                token,
                expert: expertWithoutPassword
            });
        } catch (error) {
            console.error('Expert login error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Expert Profile with their posts
    async getProfile(req, res) {
        try {
            const expertId = req.user.user_id;
            const expert = await ExpertModel.getExpertById(expertId);

            if (!expert) {
                return res.status(404).json({ error: 'Expert not found' });
            }

            // Remove sensitive information
            const { password, ...expertProfile } = expert;

            // Get expert's posts
            const PostModel = require('../model/posts');
            const postsResult = await PostModel.getPostsByExpertId(expertId, 10);
            const posts = postsResult.success ? postsResult.posts : [];

            return res.status(200).json({
                message: 'Expert profile retrieved successfully',
                expert: expertProfile,
                posts: posts
            });
        } catch (error) {
            console.error('Get expert profile error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update Expert Profile
    async updateProfile(req, res) {
        try {
            const expertId = req.user.user_id;
            const updates = req.body;

            // Don't allow updating certain fields
            delete updates.email;
            delete updates.role;
            delete updates.isVerified;
            delete updates.status;

            const result = await ExpertModel.updateExpert(expertId, updates);

            if (!result.success) {
                return res.status(400).json({ error: result.error || 'Failed to update profile' });
            }

            // Get updated expert data
            const updatedExpert = await ExpertModel.getExpertById(expertId);
            const { password, ...expertProfile } = updatedExpert;

            return res.status(200).json({
                message: 'Profile updated successfully',
                expert: expertProfile
            });
        } catch (error) {
            console.error('Update expert profile error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get All Experts (admin only)
    async getAllExperts(req, res) {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
            }

            const experts = await ExpertModel.getAllExperts();

            // Remove sensitive information
            const expertsWithoutPasswords = experts.map(expert => {
                const { password, ...expertWithoutPassword } = expert;
                return expertWithoutPassword;
            });

            return res.status(200).json({
                message: 'Experts retrieved successfully',
                experts: expertsWithoutPasswords
            });
        } catch (error) {
            console.error('Get all experts error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Verify Expert (admin only)
    async verifyExpert(req, res) {
        try {
            // Check if user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
            }

            const { expertId } = req.params;

            const result = await ExpertModel.verifyExpert(expertId);

            if (!result.success) {
                return res.status(400).json({ error: result.error || 'Failed to verify expert' });
            }

            return res.status(200).json({
                message: 'Expert verified successfully'
            });
        } catch (error) {
            console.error('Verify expert error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Verified Experts (public)
    async getVerifiedExperts(req, res) {
        try {
            const experts = await ExpertModel.getVerifiedExperts();

            // Remove sensitive information
            const expertsWithoutPasswords = experts.map(expert => {
                const { password, ...expertWithoutPassword } = expert;
                return expertWithoutPassword;
            });

            return res.status(200).json({
                message: 'Verified experts retrieved successfully',
                experts: expertsWithoutPasswords
            });
        } catch (error) {
            console.error('Get verified experts error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get Experts by Specialty (public)
    async getExpertsBySpecialty(req, res) {
        try {
            const { specialty } = req.params;

            if (!specialty) {
                return res.status(400).json({ error: 'Specialty parameter is required' });
            }

            const experts = await ExpertModel.getExpertsBySpecialty(specialty);

            // Remove sensitive information
            const expertsWithoutPasswords = experts.map(expert => {
                const { password, ...expertWithoutPassword } = expert;
                return expertWithoutPassword;
            });

            return res.status(200).json({
                message: `Experts with specialty '${specialty}' retrieved successfully`,
                experts: expertsWithoutPasswords
            });
        } catch (error) {
            console.error('Get experts by specialty error:', error.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = ExpertController;

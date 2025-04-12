const PostModel = require('../model/posts');

const PostController = {
    // Create a new post (only for experts)
    async createPost(req, res) {
        try {
            // Check if user is authenticated and is an expert
            if (!req.user || req.user.role !== 'expert') {
                return res.status(403).json({ error: 'Only experts can create posts' });
            }

            const { title, description, tags } = req.body;

            // Validate required fields
            if (!title || !description) {
                return res.status(400).json({ error: 'Title and description are required' });
            }

            // Create post data
            const postData = {
                expertId: req.user.user_id,
                title,
                description,
                tags: tags || []
            };

            // Create post
            const result = await PostModel.createPost(postData);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(201).json({
                message: 'Post created successfully',
                post: result.post
            });
        } catch (error) {
            console.error('Create post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all posts with pagination
    async getAllPosts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const startAfter = req.query.startAfter || null;

            const result = await PostModel.getAllPosts(limit, startAfter);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                posts: result.posts,
                lastVisible: result.lastVisible,
                hasMore: result.posts.length === limit
            });
        } catch (error) {
            console.error('Get all posts error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get a single post by ID
    async getPostById(req, res) {
        try {
            const { postId } = req.params;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            const result = await PostModel.getPostById(postId);

            if (!result.success) {
                return res.status(404).json({ error: result.error });
            }

            return res.status(200).json({
                post: result.post
            });
        } catch (error) {
            console.error('Get post by ID error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get posts by expert ID
    async getPostsByExpertId(req, res) {
        try {
            const { expertId } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const startAfter = req.query.startAfter || null;

            if (!expertId) {
                return res.status(400).json({ error: 'Expert ID is required' });
            }

            const result = await PostModel.getPostsByExpertId(expertId, limit, startAfter);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                posts: result.posts,
                lastVisible: result.lastVisible,
                hasMore: result.posts.length === limit
            });
        } catch (error) {
            console.error('Get posts by expert ID error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get posts by tag
    async getPostsByTag(req, res) {
        try {
            const { tag } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const startAfter = req.query.startAfter || null;

            if (!tag) {
                return res.status(400).json({ error: 'Tag is required' });
            }

            const result = await PostModel.getPostsByTag(tag, limit, startAfter);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                posts: result.posts,
                lastVisible: result.lastVisible,
                hasMore: result.posts.length === limit
            });
        } catch (error) {
            console.error('Get posts by tag error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update a post (only by the expert who created it)
    async updatePost(req, res) {
        try {
            // Check if user is authenticated and is an expert
            if (!req.user || req.user.role !== 'expert') {
                return res.status(403).json({ error: 'Only experts can update posts' });
            }

            const { postId } = req.params;
            const { title, description, tags } = req.body;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            // Prepare updates
            const updates = {};
            if (title) updates.title = title;
            if (description) updates.description = description;
            if (tags) updates.tags = tags;

            // Update post
            const result = await PostModel.updatePost(postId, req.user.user_id, updates);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                message: result.message
            });
        } catch (error) {
            console.error('Update post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete a post (only by the expert who created it)
    async deletePost(req, res) {
        try {
            // Check if user is authenticated and is an expert
            if (!req.user || req.user.role !== 'expert') {
                return res.status(403).json({ error: 'Only experts can delete posts' });
            }

            const { postId } = req.params;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            // Delete post
            const result = await PostModel.deletePost(postId, req.user.user_id);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                message: result.message
            });
        } catch (error) {
            console.error('Delete post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Like a post
    async likePost(req, res) {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const { postId } = req.params;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            // Like post
            const result = await PostModel.likePost(postId, req.user.user_id);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                message: result.message
            });
        } catch (error) {
            console.error('Like post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Unlike a post
    async unlikePost(req, res) {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const { postId } = req.params;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            // Unlike post
            const result = await PostModel.unlikePost(postId, req.user.user_id);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                message: result.message
            });
        } catch (error) {
            console.error('Unlike post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Add trust rating to a post
    async trustPost(req, res) {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const { postId } = req.params;
            const { trustValue } = req.body;

            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            if (!trustValue || isNaN(trustValue) || trustValue < 1 || trustValue > 5) {
                return res.status(400).json({ error: 'Trust value must be a number between 1 and 5' });
            }

            // Add trust rating
            const result = await PostModel.trustPost(postId, req.user.user_id, parseInt(trustValue));

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                message: result.message,
                newTrustAverage: result.newTrustAverage
            });
        } catch (error) {
            console.error('Trust post error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Search posts
    async searchPosts(req, res) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;

            if (!query) {
                return res.status(400).json({ error: 'Search query is required' });
            }

            const result = await PostModel.searchPosts(query, limit);

            if (!result.success) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({
                posts: result.posts
            });
        } catch (error) {
            console.error('Search posts error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = PostController;

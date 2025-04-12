const express = require('express');
const router = express.Router();
const PostController = require('../controller/posts');
const { authenticateToken } = require('../middleware/auth');

// Public routes
// Get all posts with pagination
// Example: GET /posts?limit=10&startAfter=lastPostId
router.get('/', PostController.getAllPosts);

// Get posts by expert ID
// Example: GET /posts/expert/abc123?limit=10&startAfter=lastPostId
router.get('/expert/:expertId', PostController.getPostsByExpertId);

// Get posts by tag
// Example: GET /posts/tag/finance?limit=10&startAfter=lastPostId
router.get('/tag/:tag', PostController.getPostsByTag);

// Search posts
// Example: GET /posts/search?query=retirement&limit=10
router.get('/search', PostController.searchPosts);

// Get a single post by ID
router.get('/:postId', PostController.getPostById);

// Protected routes (require authentication)
// Create a new post (only for experts)
router.post('/', authenticateToken, PostController.createPost);

// Update a post (only by the expert who created it)
router.put('/:postId', authenticateToken, PostController.updatePost);

// Delete a post (only by the expert who created it)
router.delete('/:postId', authenticateToken, PostController.deletePost);

// Like a post
router.post('/:postId/like', authenticateToken, PostController.likePost);

// Unlike a post
router.post('/:postId/unlike', authenticateToken, PostController.unlikePost);

// Add trust rating to a post
router.post('/:postId/trust', authenticateToken, PostController.trustPost);

module.exports = router;

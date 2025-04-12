const db = require('../config/firebase/connection');
const ExpertModel = require('./experts');

const postsRef = db.collection('posts');

const PostModel = {
    // Create a new post (only for experts)
    async createPost(postData) {
        try {
            // Validate that the expert exists
            const expert = await ExpertModel.getExpertById(postData.expertId);
            if (!expert) {
                return { success: false, error: 'Expert not found' };
            }

            // Prepare post data
            const newPost = {
                expertId: postData.expertId,
                expertName: expert.name,
                title: postData.title,
                description: postData.description,
                tags: postData.tags || [],
                likes: 0,
                trust: {
                    sum: 0,
                    count: 0,
                    average: 0
                },
                trustedBy: [],
                likedBy: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Add post to Firestore
            const docRef = await postsRef.add(newPost);

            // Update the document to include its own ID
            const postId = docRef.id;
            await postsRef.doc(postId).update({ postId: postId });

            // Add the postId to the newPost object for the response
            newPost.postId = postId;

            return {
                success: true,
                postId: postId,
                post: { id: postId, postId: postId, ...newPost }
            };
        } catch (err) {
            console.error('Error creating post:', err);
            return { success: false, error: err.message };
        }
    },

    // Get all posts with pagination
    async getAllPosts(limit = 10, startAfter = null) {
        try {
            let query = postsRef.orderBy('createdAt', 'desc').limit(limit);

            if (startAfter) {
                const doc = await postsRef.doc(startAfter).get();
                if (doc.exists) {
                    query = query.startAfter(doc);
                }
            }

            const snapshot = await query.get();
            const posts = [];

            for (const doc of snapshot.docs) {
                const postData = doc.data();
                // Ensure postId is set
                if (!postData.postId) {
                    postData.postId = doc.id;
                    // Update the document to include its own ID if it's missing
                    await postsRef.doc(doc.id).update({ postId: doc.id });
                }
                posts.push({ id: doc.id, ...postData });
            }

            return {
                success: true,
                posts,
                lastVisible: posts.length > 0 ? posts[posts.length - 1].id : null
            };
        } catch (err) {
            console.error('Error getting posts:', err);
            return { success: false, error: err.message };
        }
    },

    // Get a single post by ID
    async getPostById(postId) {
        try {
            const doc = await postsRef.doc(postId).get();

            if (!doc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const postData = doc.data();
            // Ensure postId is set
            if (!postData.postId) {
                postData.postId = doc.id;
                // Update the document to include its own ID if it's missing
                await postsRef.doc(doc.id).update({ postId: doc.id });
            }

            return {
                success: true,
                post: { id: doc.id, ...postData }
            };
        } catch (err) {
            console.error('Error getting post:', err);
            return { success: false, error: err.message };
        }
    },

    // Get posts by expert ID
    async getPostsByExpertId(expertId, limit = 10, startAfter = null) {
        try {
            let query = postsRef.where('expertId', '==', expertId)
                               .orderBy('createdAt', 'desc')
                               .limit(limit);

            if (startAfter) {
                const doc = await postsRef.doc(startAfter).get();
                if (doc.exists) {
                    query = query.startAfter(doc);
                }
            }

            const snapshot = await query.get();
            const posts = [];

            for (const doc of snapshot.docs) {
                const postData = doc.data();
                // Ensure postId is set
                if (!postData.postId) {
                    postData.postId = doc.id;
                    // Update the document to include its own ID if it's missing
                    await postsRef.doc(doc.id).update({ postId: doc.id });
                }
                posts.push({ id: doc.id, ...postData });
            }

            return {
                success: true,
                posts,
                lastVisible: posts.length > 0 ? posts[posts.length - 1].id : null
            };
        } catch (err) {
            console.error('Error getting expert posts:', err);
            return { success: false, error: err.message };
        }
    },

    // Get posts by tag
    async getPostsByTag(tag, limit = 10, startAfter = null) {
        try {
            let query = postsRef.where('tags', 'array-contains', tag)
                               .orderBy('createdAt', 'desc')
                               .limit(limit);

            if (startAfter) {
                const doc = await postsRef.doc(startAfter).get();
                if (doc.exists) {
                    query = query.startAfter(doc);
                }
            }

            const snapshot = await query.get();
            const posts = [];

            for (const doc of snapshot.docs) {
                const postData = doc.data();
                // Ensure postId is set
                if (!postData.postId) {
                    postData.postId = doc.id;
                    // Update the document to include its own ID if it's missing
                    await postsRef.doc(doc.id).update({ postId: doc.id });
                }
                posts.push({ id: doc.id, ...postData });
            }

            return {
                success: true,
                posts,
                lastVisible: posts.length > 0 ? posts[posts.length - 1].id : null
            };
        } catch (err) {
            console.error('Error getting posts by tag:', err);
            return { success: false, error: err.message };
        }
    },

    // Update a post (only by the expert who created it)
    async updatePost(postId, expertId, updates) {
        try {
            // Get the post
            const postDoc = await postsRef.doc(postId).get();

            if (!postDoc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const post = postDoc.data();

            // Check if the expert is the author
            if (post.expertId !== expertId) {
                return { success: false, error: 'Unauthorized. Only the author can update this post' };
            }

            // Prepare updates
            const validUpdates = {};

            if (updates.title) validUpdates.title = updates.title;
            if (updates.description) validUpdates.description = updates.description;
            if (updates.tags) validUpdates.tags = updates.tags;

            validUpdates.updatedAt = new Date();

            // Update the post
            await postsRef.doc(postId).update(validUpdates);

            return {
                success: true,
                message: 'Post updated successfully'
            };
        } catch (err) {
            console.error('Error updating post:', err);
            return { success: false, error: err.message };
        }
    },

    // Delete a post (only by the expert who created it)
    async deletePost(postId, expertId) {
        try {
            // Get the post
            const postDoc = await postsRef.doc(postId).get();

            if (!postDoc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const post = postDoc.data();

            // Check if the expert is the author
            if (post.expertId !== expertId) {
                return { success: false, error: 'Unauthorized. Only the author can delete this post' };
            }

            // Delete the post
            await postsRef.doc(postId).delete();

            return {
                success: true,
                message: 'Post deleted successfully'
            };
        } catch (err) {
            console.error('Error deleting post:', err);
            return { success: false, error: err.message };
        }
    },

    // Like a post
    async likePost(postId, userId) {
        try {
            // Get the post
            const postDoc = await postsRef.doc(postId).get();

            if (!postDoc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const post = postDoc.data();

            // Check if user already liked the post
            if (post.likedBy && post.likedBy.includes(userId)) {
                return { success: false, error: 'You have already liked this post' };
            }

            // Update likes count and likedBy array
            const likedBy = post.likedBy || [];
            likedBy.push(userId);

            await postsRef.doc(postId).update({
                likes: (post.likes || 0) + 1,
                likedBy: likedBy
            });

            return {
                success: true,
                message: 'Post liked successfully'
            };
        } catch (err) {
            console.error('Error liking post:', err);
            return { success: false, error: err.message };
        }
    },

    // Unlike a post
    async unlikePost(postId, userId) {
        try {
            // Get the post
            const postDoc = await postsRef.doc(postId).get();

            if (!postDoc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const post = postDoc.data();

            // Check if user has liked the post
            if (!post.likedBy || !post.likedBy.includes(userId)) {
                return { success: false, error: 'You have not liked this post' };
            }

            // Update likes count and likedBy array
            const likedBy = post.likedBy.filter(id => id !== userId);

            await postsRef.doc(postId).update({
                likes: Math.max(0, (post.likes || 1) - 1),
                likedBy: likedBy
            });

            return {
                success: true,
                message: 'Post unliked successfully'
            };
        } catch (err) {
            console.error('Error unliking post:', err);
            return { success: false, error: err.message };
        }
    },

    // Add trust rating to a post
    async trustPost(postId, userId, trustValue) {
        try {
            // Validate trust value (1-5)
            if (trustValue < 1 || trustValue > 5) {
                return { success: false, error: 'Trust value must be between 1 and 5' };
            }

            // Get the post
            const postDoc = await postsRef.doc(postId).get();

            if (!postDoc.exists) {
                return { success: false, error: 'Post not found' };
            }

            const post = postDoc.data();

            // Check if user already trusted the post
            const trustedBy = post.trustedBy || [];
            const existingTrustIndex = trustedBy.findIndex(item => item.userId === userId);

            let newTrust = { ...post.trust } || { sum: 0, count: 0, average: 0 };

            if (existingTrustIndex >= 0) {
                // Update existing trust
                const oldValue = trustedBy[existingTrustIndex].value;
                trustedBy[existingTrustIndex].value = trustValue;

                // Update trust metrics
                newTrust.sum = newTrust.sum - oldValue + trustValue;
            } else {
                // Add new trust
                trustedBy.push({ userId, value: trustValue });

                // Update trust metrics
                newTrust.sum = (newTrust.sum || 0) + trustValue;
                newTrust.count = (newTrust.count || 0) + 1;
            }

            // Calculate new average
            newTrust.average = newTrust.count > 0 ? newTrust.sum / newTrust.count : 0;

            // Update the post
            await postsRef.doc(postId).update({
                trust: newTrust,
                trustedBy: trustedBy
            });

            return {
                success: true,
                message: 'Trust rating added successfully',
                newTrustAverage: newTrust.average
            };
        } catch (err) {
            console.error('Error adding trust rating:', err);
            return { success: false, error: err.message };
        }
    },

    // Search posts by title or description
    async searchPosts(query, limit = 10) {
        try {
            // Firebase doesn't support full-text search natively
            // This is a simple implementation that gets all posts and filters them
            // For production, consider using Algolia, Elasticsearch, or Firebase Extensions

            const snapshot = await postsRef.orderBy('createdAt', 'desc').get();
            const posts = [];

            for (const doc of snapshot.docs) {
                const postData = doc.data();
                const searchableText = `${postData.title} ${postData.description}`.toLowerCase();

                // Ensure postId is set
                if (!postData.postId) {
                    postData.postId = doc.id;
                    // Update the document to include its own ID if it's missing
                    await postsRef.doc(doc.id).update({ postId: doc.id });
                }

                if (searchableText.includes(query.toLowerCase())) {
                    posts.push({ id: doc.id, ...postData });
                }
            }

            // Limit results
            const limitedPosts = posts.slice(0, limit);

            return {
                success: true,
                posts: limitedPosts
            };
        } catch (err) {
            console.error('Error searching posts:', err);
            return { success: false, error: err.message };
        }
    }
};

module.exports = PostModel;
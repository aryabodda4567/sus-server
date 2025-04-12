const db = require('../config/firebase/connection'); // Adjust path as needed
const bcrypt = require('bcryptjs'); // For password hashing/comparison

const usersRef = db.collection('users');

const UserModel = {
    // Insert a new user
    insertUser: async (userData) => {
        try {
            userData.createdAt = new Date();
            const res = await usersRef.add(userData);
            return { success: true, id: res.id };
        } catch (err) {
            console.error('Error inserting user:', err);
            return { success: false, error: err.message };
        }
    },

    // Delete user by email
    deleteUserByEmail: async (email) => {
        try {
            const snapshot = await usersRef.where('email', '==', email).get();
            if (snapshot.empty) return { success: false, message: 'User not found' };
            snapshot.forEach(doc => doc.ref.delete());
            return { success: true, message: 'User(s) deleted by email' };
        } catch (err) {
            console.error('Error deleting user by email:', err);
            return { success: false, error: err.message };
        }
    },

    // Delete user by Firestore doc ID
    deleteUserById: async (userId) => {
        try {
            await usersRef.doc(userId).delete();
            return { success: true, message: 'User deleted by ID' };
        } catch (err) {
            console.error('Error deleting user by ID:', err);
            return { success: false, error: err.message };
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            const snapshot = await usersRef.get();
            const users = [];
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
            return users;
        } catch (err) {
            console.error('Error getting all users:', err);
            return [];
        }
    },

    // Get user by email
    getUserByEmail: async (email) => {
        try {
            const snapshot = await usersRef.where('email', '==', email).get();
            if (snapshot.empty) return null;

            let user = null;
            snapshot.forEach(doc => {
                user = { id: doc.id, ...doc.data() };
            });
            console.log(user);
            return user;
        } catch (err) {
            console.error('Error getting user by email:', err);
            return null;
        }
    },

    // Get user by Firestore doc ID
    getUserById: async (userId) => {
        try {
            const doc = await usersRef.doc(userId).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() };
        } catch (err) {
            console.error('Error getting user by ID:', err);
            return null;
        }
    },

    validateLogin : async (email, password) => {
        try {
            const user = await UserModel.getUserByEmail(email);
            console.log(user);

            if (!user) {
                return { success: false, message: 'User not found' };
            }

            const isMatch = await bcrypt.compare(password, user.password);


            if (isMatch) {
                return { success: true, user }; // You can return user data if needed
            } else {
                return { success: false, message: 'Invalid password' };
            }

        } catch (err) {
            console.error('Login validation error:', err);
            return { success: false, error: err.message };
        }
    },

    // Update user (partial update)
    updateUser: async (userId, updates) => {
        try {
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }
            updates.updatedAt = new Date();

            await usersRef.doc(userId).update(updates);
            return { success: true, message: 'User updated' };
        } catch (err) {
            console.error('Error updating user:', err);
            return { success: false, error: err.message };
        }
    },

    // Fetch users with pagination
    fetchUsersWithPagination: async (startAfterUserId = null, count = 5) => {
        try {
            let query = usersRef.orderBy('__name__').limit(count);

            if (startAfterUserId) {
                const doc = await usersRef.doc(startAfterUserId).get();
                if (!doc.exists) return [];
                query = query.startAfter(doc);
            }
            const snapshot = await query.get();
            const users = [];
            snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
            return users;
        } catch (err) {
            console.error('Pagination error:', err);
            return [];
        }
    }
};

module.exports = UserModel;

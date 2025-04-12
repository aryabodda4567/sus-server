const db = require('../config/firebase/connection'); // Adjust path as needed
const bcrypt = require('bcryptjs'); // For password hashing/comparison

const expertsRef = db.collection('experts');

const ExpertModel = {
    // Insert a new expert
    insertExpert: async (expertData) => {
        try {
            expertData.createdAt = new Date();
            expertData.role = 'expert'; // Set role explicitly
            expertData.isVerified = true; // Experts are automatically verified
            expertData.status = 'active'; // Set status as active

            const res = await expertsRef.add(expertData);
            return { success: true, id: res.id };
        } catch (err) {
            console.error('Error inserting expert:', err);
            return { success: false, error: err.message };
        }
    },

    // Delete expert by email
    deleteExpertByEmail: async (email) => {
        try {
            const snapshot = await expertsRef.where('email', '==', email).get();
            if (snapshot.empty) return { success: false, message: 'Expert not found' };
            snapshot.forEach(doc => doc.ref.delete());
            return { success: true, message: 'Expert(s) deleted by email' };
        } catch (err) {
            console.error('Error deleting expert by email:', err);
            return { success: false, error: err.message };
        }
    },

    // Delete expert by Firestore doc ID
    deleteExpertById: async (expertId) => {
        try {
            await expertsRef.doc(expertId).delete();
            return { success: true, message: 'Expert deleted by ID' };
        } catch (err) {
            console.error('Error deleting expert by ID:', err);
            return { success: false, error: err.message };
        }
    },

    // Get all experts
    getAllExperts: async () => {
        try {
            const snapshot = await expertsRef.get();
            const experts = [];
            snapshot.forEach(doc => experts.push({ id: doc.id, ...doc.data() }));
            return experts;
        } catch (err) {
            console.error('Error getting all experts:', err);
            return [];
        }
    },

    // Get expert by email
    getExpertByEmail: async (email) => {
        try {
            const snapshot = await expertsRef.where('email', '==', email).get();
            if (snapshot.empty) return null;

            let expert = null;
            snapshot.forEach(doc => {
                expert = { id: doc.id, ...doc.data() };
            });
            return expert;
        } catch (err) {
            console.error('Error getting expert by email:', err);
            return null;
        }
    },

    // Get expert by Firestore doc ID
    getExpertById: async (expertId) => {
        try {
            const doc = await expertsRef.doc(expertId).get();
            if (!doc.exists) return null;
            return { id: doc.id, ...doc.data() };
        } catch (err) {
            console.error('Error getting expert by ID:', err);
            return null;
        }
    },

    // Update expert (partial update)
    updateExpert: async (expertId, updates) => {
        try {
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }
            updates.updatedAt = new Date();

            await expertsRef.doc(expertId).update(updates);
            return { success: true, message: 'Expert updated' };
        } catch (err) {
            console.error('Error updating expert:', err);
            return { success: false, error: err.message };
        }
    },

    // Verify expert (set isVerified to true)
    verifyExpert: async (expertId) => {
        try {
            await expertsRef.doc(expertId).update({
                isVerified: true,
                status: 'active',
                verifiedAt: new Date()
            });
            return { success: true, message: 'Expert verified successfully' };
        } catch (err) {
            console.error('Error verifying expert:', err);
            return { success: false, error: err.message };
        }
    },

    // Get verified experts
    getVerifiedExperts: async () => {
        try {
            const snapshot = await expertsRef.where('isVerified', '==', true).get();
            const experts = [];
            snapshot.forEach(doc => experts.push({ id: doc.id, ...doc.data() }));
            return experts;
        } catch (err) {
            console.error('Error getting verified experts:', err);
            return [];
        }
    },

    // Get experts by specialty
    getExpertsBySpecialty: async (specialty) => {
        try {
            const snapshot = await expertsRef
                .where('specialties', 'array-contains', specialty)
                .where('isVerified', '==', true)
                .get();

            const experts = [];
            snapshot.forEach(doc => experts.push({ id: doc.id, ...doc.data() }));
            return experts;
        } catch (err) {
            console.error('Error getting experts by specialty:', err);
            return [];
        }
    },

    // Fetch experts with pagination
    fetchExpertsWithPagination: async (startAfterExpertId = null, count = 5) => {
        try {
            let query = expertsRef.orderBy('__name__').limit(count);

            if (startAfterExpertId) {
                const doc = await expertsRef.doc(startAfterExpertId).get();
                if (!doc.exists) return [];
                query = query.startAfter(doc);
            }
            const snapshot = await query.get();
            const experts = [];
            snapshot.forEach(doc => experts.push({ id: doc.id, ...doc.data() }));
            return experts;
        } catch (err) {
            console.error('Pagination error:', err);
            return [];
        }
    }
};

module.exports = ExpertModel;
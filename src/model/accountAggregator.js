const db = require('../config/firebase/connection');

const accountAggregatorRef = db.collection('account_aggregator');

const AccountAggregatorModel = {
    // Store account aggregator data for a user
    storeData: async (userId, data) => {
        try {
            // Check if user already has account aggregator data
            const docRef = accountAggregatorRef.doc(userId);
            const doc = await docRef.get();

            if (doc.exists) {
                // Update existing document
                await docRef.update({
                    data: data,
                    updatedAt: new Date()
                });

                return {
                    success: true,
                    message: 'Account aggregator data updated successfully',
                    id: userId
                };
            } else {
                // Create new document with userId as the document ID
                await docRef.set({
                    data: data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                return {
                    success: true,
                    message: 'Account aggregator data stored successfully',
                    id: userId
                };
            }
        } catch (err) {
            console.error('Error storing account aggregator data:', err);
            return {
                success: false,
                error: err.message
            };
        }
    },

    // Get account aggregator data for a user
    getData: async (userId) => {
        try {
            const docRef = accountAggregatorRef.doc(userId);
            const doc = await docRef.get();

            if (!doc.exists) {
                return {
                    success: false,
                    error: 'No account aggregator data found for this user'
                };
            }

            const data = {
                id: doc.id,
                ...doc.data()
            };

            return {
                success: true,
                data: data
            };
        } catch (err) {
            console.error('Error getting account aggregator data:', err);
            return {
                success: false,
                error: err.message
            };
        }
    },

    // Delete account aggregator data for a user
    deleteData: async (userId) => {
        try {
            const docRef = accountAggregatorRef.doc(userId);
            const doc = await docRef.get();

            if (!doc.exists) {
                return {
                    success: false,
                    error: 'No account aggregator data found for this user'
                };
            }

            // Delete the document
            await docRef.delete();

            return {
                success: true,
                message: 'Account aggregator data deleted successfully'
            };
        } catch (err) {
            console.error('Error deleting account aggregator data:', err);
            return {
                success: false,
                error: err.message
            };
        }
    }
};

module.exports = AccountAggregatorModel;

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Function to get Firebase credentials
function getFirebaseCredentials() {
    // First, try to use environment variable
    if (process.env.FIREBASE_CREDENTIALS) {
        try {
            return JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } catch (error) {
            console.error('Error parsing FIREBASE_CREDENTIALS environment variable:', error);
        }
    }

    // Then, try to load from file
    const credPath = path.join(__dirname, 'firebase_cred.json');
    try {
        if (fs.existsSync(credPath)) {
            return require(credPath);
        }
    } catch (error) {
        console.error('Error loading firebase_cred.json:', error);
    }

    // If we get here, we couldn't load credentials
    throw new Error('Firebase credentials not found. Please set FIREBASE_CREDENTIALS environment variable or provide firebase_cred.json file.');
}

// Get Firebase credentials
let serviceAccount;
try {
    serviceAccount = getFirebaseCredentials();
    console.log('Firebase credentials loaded successfully');
} catch (error) {
    console.error('Failed to load Firebase credentials:', error.message);
    process.exit(1); // Exit the process if credentials can't be loaded
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
        process.exit(1); // Exit the process if Firebase can't be initialized
    }
}

const db = admin.firestore();

console.log('Connected to Firebase Firestore');

module.exports = db;

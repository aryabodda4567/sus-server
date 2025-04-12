const admin = require('firebase-admin');
const serviceAccount = require('./firebase_cred.json'); // Adjust the path if needed

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: "https://<your-database-name>.firebaseio.com" // Replace with your Firebase database URL
    });
}

const db = admin.firestore();

console.log("Connected to Firebase Firestore");

module.exports = db;

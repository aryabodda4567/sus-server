/**
 * This script verifies that Firebase credentials are valid
 * Run with: node verify-firebase-credentials.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('Firebase Credentials Verification Tool');
console.log('=====================================');

// Function to get Firebase credentials
function getFirebaseCredentials() {
    // First, try to use environment variable
    if (process.env.FIREBASE_CREDENTIALS) {
        try {
            console.log('Found FIREBASE_CREDENTIALS environment variable');
            return JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } catch (error) {
            console.error('Error parsing FIREBASE_CREDENTIALS environment variable:', error);
        }
    }

    // Then, try to load from file
    const credPath = path.join(__dirname, 'src', 'config', 'firebase', 'firebase_cred.json');
    try {
        if (fs.existsSync(credPath)) {
            console.log(`Found credentials file at: ${credPath}`);
            return require(credPath);
        } else {
            console.error(`Credentials file not found at: ${credPath}`);
        }
    } catch (error) {
        console.error('Error loading firebase_cred.json:', error);
    }

    // If we get here, we couldn't load credentials
    throw new Error('Firebase credentials not found. Please set FIREBASE_CREDENTIALS environment variable or provide firebase_cred.json file.');
}

// Verify credentials structure
function verifyCredentialsStructure(credentials) {
    console.log('\nVerifying credentials structure...');
    
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email', 'client_id'];
    const missingFields = [];
    
    for (const field of requiredFields) {
        if (!credentials[field]) {
            missingFields.push(field);
        }
    }
    
    if (missingFields.length > 0) {
        console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
        return false;
    }
    
    console.log('✅ All required fields are present');
    
    // Verify private key format
    if (!credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
        console.error('❌ Private key is not in the correct format');
        return false;
    }
    
    console.log('✅ Private key format is valid');
    return true;
}

// Test Firebase connection
async function testFirebaseConnection(credentials) {
    console.log('\nTesting Firebase connection...');
    
    try {
        // Initialize Firebase Admin SDK
        if (admin.apps.length) {
            admin.app().delete();
        }
        
        admin.initializeApp({
            credential: admin.credential.cert(credentials)
        });
        
        console.log('✅ Firebase Admin SDK initialized successfully');
        
        // Test Firestore connection
        const db = admin.firestore();
        const testDoc = db.collection('_test_connection').doc('test');
        
        await testDoc.set({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            test: 'Connection test'
        });
        
        console.log('✅ Successfully wrote to Firestore');
        
        const docData = await testDoc.get();
        console.log('✅ Successfully read from Firestore');
        
        await testDoc.delete();
        console.log('✅ Successfully deleted test document');
        
        return true;
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        return false;
    }
}

// Main function
async function main() {
    try {
        // Get credentials
        const credentials = getFirebaseCredentials();
        
        // Verify structure
        const structureValid = verifyCredentialsStructure(credentials);
        if (!structureValid) {
            console.error('\n❌ Credentials structure verification failed');
            process.exit(1);
        }
        
        // Test connection
        const connectionValid = await testFirebaseConnection(credentials);
        if (!connectionValid) {
            console.error('\n❌ Firebase connection test failed');
            process.exit(1);
        }
        
        console.log('\n✅ Firebase credentials are valid and working correctly');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        process.exit(1);
    }
}

// Run the main function
main();

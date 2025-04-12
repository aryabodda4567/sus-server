/**
 * This script checks and fixes common Firebase credential permission issues
 * Run with: npm run fix-firebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Firebase Credentials Permission Fixer');
console.log('=====================================');

// Function to check if gcloud CLI is installed
function checkGcloudInstalled() {
    try {
        execSync('gcloud --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Function to get Firebase credentials
function getFirebaseCredentials() {
    const credPath = path.join(__dirname, 'src', 'config', 'firebase', 'firebase_cred.json');
    try {
        if (fs.existsSync(credPath)) {
            console.log(`Found credentials file at: ${credPath}`);
            return require(credPath);
        } else {
            console.error(`Credentials file not found at: ${credPath}`);
            return null;
        }
    } catch (error) {
        console.error('Error loading firebase_cred.json:', error);
        return null;
    }
}

// Main function
async function main() {
    try {
        // Check if gcloud CLI is installed
        const gcloudInstalled = checkGcloudInstalled();
        if (!gcloudInstalled) {
            console.log('❌ Google Cloud SDK (gcloud) is not installed.');
            console.log('Please install it from: https://cloud.google.com/sdk/docs/install');
            console.log('Then run this script again.');
            process.exit(1);
        }

        // Get credentials
        const credentials = getFirebaseCredentials();
        if (!credentials) {
            console.error('❌ Could not load Firebase credentials.');
            process.exit(1);
        }

        // Extract project ID and service account email
        const projectId = credentials.project_id;
        const serviceAccountEmail = credentials.client_email;

        if (!projectId || !serviceAccountEmail) {
            console.error('❌ Invalid credentials: missing project_id or client_email.');
            process.exit(1);
        }

        console.log(`Project ID: ${projectId}`);
        console.log(`Service Account: ${serviceAccountEmail}`);

        // Authenticate with gcloud (if needed)
        console.log('\nChecking gcloud authentication...');
        try {
            const authListOutput = execSync('gcloud auth list --format="value(account)"').toString().trim();
            if (!authListOutput) {
                console.log('❌ Not authenticated with gcloud. Please run:');
                console.log('gcloud auth login');
                process.exit(1);
            }
            console.log(`✅ Authenticated as: ${authListOutput}`);
        } catch (error) {
            console.error('❌ Error checking gcloud authentication:', error.message);
            console.log('Please run: gcloud auth login');
            process.exit(1);
        }

        // Set the current project
        console.log(`\nSetting current project to: ${projectId}`);
        try {
            execSync(`gcloud config set project ${projectId}`, { stdio: 'inherit' });
            console.log('✅ Project set successfully');
        } catch (error) {
            console.error('❌ Error setting project:', error.message);
            process.exit(1);
        }

        // Check if Firestore API is enabled
        console.log('\nChecking if Firestore API is enabled...');
        try {
            const apiStatus = execSync(`gcloud services list --filter="name:firestore.googleapis.com" --format="value(state)"`).toString().trim();
            if (apiStatus === 'ENABLED') {
                console.log('✅ Firestore API is enabled');
            } else {
                console.log('❌ Firestore API is not enabled. Enabling it now...');
                execSync('gcloud services enable firestore.googleapis.com', { stdio: 'inherit' });
                console.log('✅ Firestore API enabled successfully');
            }
        } catch (error) {
            console.error('❌ Error checking/enabling Firestore API:', error.message);
            console.log('Please enable the Firestore API manually in the Google Cloud Console.');
        }

        // Check and add IAM roles
        console.log('\nChecking and adding required IAM roles...');
        const requiredRoles = [
            'roles/datastore.user',
            'roles/firebase.sdkAdminServiceAgent',
            'roles/iam.serviceAccountUser'
        ];

        for (const role of requiredRoles) {
            try {
                console.log(`Checking role: ${role}`);
                execSync(`gcloud projects add-iam-policy-binding ${projectId} --member="serviceAccount:${serviceAccountEmail}" --role="${role}" --condition=None`, { stdio: 'inherit' });
                console.log(`✅ Role ${role} added or already exists`);
            } catch (error) {
                console.error(`❌ Error adding role ${role}:`, error.message);
            }
        }

        console.log('\n✅ Firebase permissions setup completed!');
        console.log('\nIf you still encounter authentication issues, please:');
        console.log('1. Go to the Firebase Console → Project Settings → Service Accounts');
        console.log('2. Generate a new private key');
        console.log('3. Replace your existing firebase_cred.json file with the new one');

    } catch (error) {
        console.error('\n❌ An error occurred:', error.message);
        process.exit(1);
    }
}

// Run the main function
main();

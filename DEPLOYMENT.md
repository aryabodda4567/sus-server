# Deployment Guide

This guide provides instructions for deploying the backend server to production environments.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/aryabodda4567/sus-server.git
cd sus-server
```

### 2. Install Dependencies

Make sure to install all dependencies before starting the server:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file with the following variables:

```
PORT=3001
JWT_SECRET=your_secure_jwt_secret_key
SESSION_SECRET=your_secure_session_secret_key
CLIENT_URL=https://your-frontend-url.com
```

### 4. Firebase Configuration

You have two options for configuring Firebase credentials:

#### Option 1: Using a credentials file (recommended for development)

1. Create a `firebase_cred.json` file in the `src/config/firebase/` directory with your Firebase service account credentials.
2. Make sure the file has the following structure:
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "your-private-key-id",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account-email@your-project-id.iam.gserviceaccount.com",
     "client_id": "your-client-id",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project-id.iam.gserviceaccount.com"
   }
   ```

#### Option 2: Using environment variables (recommended for production)

1. Set the `FIREBASE_CREDENTIALS` environment variable with the JSON content of your service account credentials.
2. For example, in your `.env` file:
   ```
   FIREBASE_CREDENTIALS='{"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service-account-email@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project-id.iam.gserviceaccount.com"}'
   ```

#### Verify Firebase Credentials

To verify that your Firebase credentials are valid and working correctly, run:

```bash
npm run verify-firebase
```

### 5. Build and Start

```bash
npm start
```

## Troubleshooting

### Missing Dependencies

If you encounter errors about missing dependencies (like "multer is not found"), run:

```bash
npm install multer
```

Or run the dependency checker:

```bash
node check-dependencies.js
```

### File Upload Issues

Make sure the `uploads` directory exists and has proper permissions:

```bash
mkdir -p uploads
chmod 755 uploads
```

### Firebase Authentication Errors

If you encounter errors like "UNAUTHENTICATED: Request had invalid authentication credentials", follow these steps:

1. **Verify your credentials**:
   ```bash
   npm run verify-firebase
   ```

2. **Check service account permissions**:
   - Make sure your service account has the necessary permissions in the Firebase console
   - Required roles: Firebase Admin SDK Administrator Service Agent, Cloud Datastore User

3. **Regenerate service account key**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Replace your existing `firebase_cred.json` file with the new one

4. **Check for formatting issues**:
   - Ensure the private key in your credentials file has proper newline characters
   - If using environment variables, make sure the JSON is properly escaped

5. **Verify project ID**:
   - Make sure the project ID in your credentials matches your Firebase project

6. **Enable the Firestore API**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to APIs & Services → Dashboard
   - Click "+ ENABLE APIS AND SERVICES"
   - Search for "Firestore API" and enable it

7. **Check IAM permissions**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin → IAM
   - Find your service account and ensure it has the following roles:
     - Firebase Admin SDK Administrator Service Agent
     - Cloud Datastore User
     - Service Account User

8. **Verify the service account is active**:
   - Go to IAM & Admin → Service Accounts
   - Ensure your service account is not disabled

9. **Check Firebase project settings**:
   - Make sure your Firebase project has Firestore enabled
   - Go to Firebase Console → Firestore Database and check if it's set up

## Production Deployment Checklist

- [ ] All dependencies are installed
- [ ] Environment variables are properly set
- [ ] Firebase credentials are properly configured
- [ ] Server starts without errors
- [ ] API endpoints are accessible
- [ ] File uploads work correctly
- [ ] Authentication works correctly
- [ ] Database connections are established

## Monitoring and Maintenance

- Check server logs regularly
- Monitor server performance
- Keep dependencies up to date
- Backup database regularly

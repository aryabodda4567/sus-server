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

Create a `firebase_cred.json` file in the `src/config/firebase/` directory with your Firebase service account credentials.

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

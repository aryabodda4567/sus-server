FROM node:18-alpine

WORKDIR /app

# Install dependencies required for Google Cloud authentication
RUN apk add --no-cache python3 make g++ curl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 755 uploads

# Create directory for Firebase credentials
RUN mkdir -p src/config/firebase

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/src/config/firebase/firebase_cred.json

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Command to run the application
CMD ["npm", "start"]

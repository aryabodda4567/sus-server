FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 755 uploads

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]

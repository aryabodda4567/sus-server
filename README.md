<<<<<<< HEAD
# sus-server
=======
# Kuberium Backend

This is the backend server for the Kuberium application.

## Features

- User authentication (signup, login, profile management)
- Expert authentication and management
- Posts management (create, read, update, delete)
- Account Aggregator system for storing and retrieving financial data
- API documentation with Swagger

## Tech Stack

- Node.js
- Express.js
- Firebase Firestore
- JWT for authentication
- Express Session for session management
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aryabodda4567/sus-server.git
   cd sus-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   JWT_SECRET=your_secure_jwt_secret_key
   SESSION_SECRET=your_secure_session_secret_key
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon

## License

This project is licensed under the MIT License.
>>>>>>> 9dc4034 (Initial commit: Backend setup with user authentication, expert management, posts, and account aggregator)

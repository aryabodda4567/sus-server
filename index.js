const express = require('express');
const db = require('./src/config/firebase/connection');
const userRoutes = require('./src/routes/users'); // Import user routes
const expertRoutes = require('./src/routes/experts'); // Import expert routes
const postRoutes = require('./src/routes/posts'); // Import post routes
const accountAggregatorRoutes = require('./src/routes/accountAggregator'); // Import account aggregator routes
const docsRoutes = require('./src/routes/docs'); // Import API documentation routes
const cors = require('cors'); // Import CORS middleware
const session = require('express-session'); // Import session middleware
const cookieParser = require('cookie-parser'); // Import cookie parser
require('dotenv').config(); // Load environment variables

const port = process.env.PORT || 3001; // Use environment variable for port
const SESSION_SECRET = process.env.SESSION_SECRET || 'your_session_secret_should_be_in_env_file';

const app = express();
app.use(express.json());

// Configure CORS to allow credentials
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser()); // Parse cookies

// Configure session middleware with in-memory storage (default store)
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 2 // 2 hours - shorter for in-memory sessions
    }
    // No store specified = use MemoryStore (in-memory, non-persistent)
}));

// Basic route to test if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// API Routes
app.use("/api/users", userRoutes); // User routes
app.use("/api/experts", expertRoutes); // Expert routes
app.use("/api/posts", postRoutes); // Post routes
app.use("/api/account-aggregator", accountAggregatorRoutes); // Account Aggregator routes
app.use("/api/docs", docsRoutes); // API Documentation

// Fallback route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
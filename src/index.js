const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const os = require('os');
const path = require('path');
require('dotenv').config();

// Import routes
const usersRoutes = require('./routes/users');
const expertsRoutes = require('./routes/experts');
const postsRoutes = require('./routes/posts');
const accountAggregatorRoutes = require('./routes/accountAggregator');
const docsRoutes = require('./routes/docs');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/experts', expertsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/account-aggregator', accountAggregatorRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/health', healthRoutes);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Function to get local IP address
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

// Start server
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`Server is running on:`);
    console.log(` → Local:            http://localhost:${PORT}`);
    console.log(` → On Your Network:  http://${localIP}:${PORT}`);
});

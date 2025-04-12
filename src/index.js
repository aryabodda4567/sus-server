const express = require('express');
const os = require('os');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use('/api/users', usersRoutes);


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

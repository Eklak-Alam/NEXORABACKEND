require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Register Routes
app.use('/api/books', bookRoutes);

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
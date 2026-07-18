const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));

// Health check API
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Smart Health API is running' });
});

// Database connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarthealth';
mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        // Start listening
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });

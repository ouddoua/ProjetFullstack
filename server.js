
const app = require("./app");
require('dotenv').config();
const connectDB = require("./config/db");
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 5000;

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});


const app = require("./app");
require('dotenv').config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to Database then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

 
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/restau", require("./routes/restau.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api", require("./routes/reservation.routes"));

module.exports = app;

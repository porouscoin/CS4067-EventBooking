const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const eventRoutes = require("./routes/events");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default Landing Page
app.get("/", (req, res) => {
  res.send("Welcome to the Event Service API!");
});

// Routes
app.use("/events", eventRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Event Service running on http://localhost:${PORT}`));

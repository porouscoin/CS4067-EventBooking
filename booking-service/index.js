const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Default Landing Page
app.get("/", (req, res) => {
  res.send("Booking Service is running 🚀");
});

// Booking Routes
app.use("/bookings", bookingRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Booking Service running on http://localhost:${PORT}`));

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const connectDB = require("../config/db");

// Connect to MongoDB
connectDB();

// 🔹 Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// 🔹 Get Event Availability (For Booking Service)
router.get("/:event_id/availability", async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Event.findById(event_id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ available_tickets: event.available_tickets });
    } catch (error) {
        console.error("❌ Error fetching event availability:", error);
        res.status(500).json({ error: "Failed to fetch event availability" });
    }
});

// 🔹 Add a New Event (Admin-only route later)
router.post("/add", async (req, res) => {
    try {
        const { name, description, date, location, total_tickets, price } = req.body;

        // Ensure all required fields are provided
        if (!name || !description || !date || !location || !total_tickets || !price) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        // Create new event
        const newEvent = new Event({
            name,
            description,
            date,
            location,
            total_tickets,
            available_tickets: total_tickets, // Initialize available tickets to total tickets
            price
        });

        // Save event to database
        const savedEvent = await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: savedEvent });
    } catch (error) {
        console.error("❌ Error adding new event:", error);
        res.status(500).json({ error: "Failed to add event" });
    }
});

module.exports = router;

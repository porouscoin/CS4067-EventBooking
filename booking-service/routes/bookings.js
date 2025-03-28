const express = require("express");
const axios = require("axios");
const router = express.Router();
const pool = require("../config/db");
const { getChannel } = require("../config/rabbitmq");

const EVENT_SERVICE_URL = "http://localhost:5002"; // Adjust as needed

// 🔹 Publish to RabbitMQ Queue
async function publishToQueue(message) {
  try {
    const channel = getChannel();
    const queue = "booking_notifications";

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("📩 Sent message to queue:", message);
  } catch (error) {
    console.error("❌ RabbitMQ Publish Error:", error);
  }
}

// 🔹 Book an Event (with Availability Check)
router.post("/", async (req, res) => {
  const { user_id, event_id, tickets, user_email } = req.body;
  console.log(user_email);

  try {
    // ✅ Step 1: Check Event Availability
    const response = await axios.get(`${EVENT_SERVICE_URL}/events/${event_id}/availability`);
    const availableTickets = response.data.available_tickets;
    console.log(availableTickets);

    if (availableTickets < tickets) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // ✅ Step 2: Proceed with Booking
    const total_price = tickets * 20;
    const query = `INSERT INTO bookings (user_id, event_id, tickets, total_price, status) VALUES ($1, $2, $3, $4, 'CONFIRMED') RETURNING *`;
    const values = [user_id, event_id, tickets, total_price];

    const result = await pool.query(query, values);
    const booking = result.rows[0];

    // ✅ Step 3: Send Booking Confirmation Notification (Async via RabbitMQ)
    const message = {
      booking_id: booking.id,
      user_email: user_email,
      status: "CONFIRMED",
    };
    await publishToQueue(message);

    res.json(booking);
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;

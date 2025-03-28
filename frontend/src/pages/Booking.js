import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Booking = () => {
  const [eventId, setEventId] = useState("");
  const [tickets, setTickets] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Automatically populate eventId if it's passed as a query parameter
    const queryParams = new URLSearchParams(location.search);
    const eventIdFromURL = queryParams.get("eventId");
    if (eventIdFromURL) setEventId(eventIdFromURL);
  }, [location.search]);

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user_email = localStorage.getItem("user_email"); // Retrieve user email from localStorage

    if (!token) {
      setMessage("❌ You must be logged in to book an event.");
      return;
    }

    if (!user_email) {
      setMessage("❌ User email not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/bookings",
        { event_id: eventId, tickets, user_email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setMessage("✅ Booking successful!");
      }
    } catch (error) {
      console.error("❌ Booking Error:", error.response?.data || error.message);
      setMessage("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Book an Event</h2>
      <form onSubmit={handleBooking}>
        <div>
          <label>Event ID:</label>
          <input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            readOnly={!!eventId}  // Make the input read-only if auto-filled
          />
        </div>
        <div>
          <label>Tickets:</label>
          <input
            type="number"
            value={tickets}
            onChange={(e) => setTickets(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Booking;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // React Router's navigation hook

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5002/events"); // Event Service URL
        setEvents(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleBooking = (eventId) => {
    navigate(`/Booking?eventId=${eventId}`);  // Navigate to the Booking page with eventId
  };

  return (
    <div>
      <h1>Available Events</h1>
      {events.length === 0 ? (
        <p>Loading events...</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>Available Tickets: {event.available_tickets}</p>
              <button onClick={() => handleBooking(event._id)}>Book Now</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Events;

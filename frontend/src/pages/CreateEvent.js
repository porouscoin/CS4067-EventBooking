import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
      setMessage("❌ You must be logged in as an admin to create an event.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/events/add", // Assuming this is your gateway route
        {
          name,
          description,
          date,
          location,
          total_tickets: totalTickets,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setMessage("✅ Event created successfully!");
        navigate("/events"); // Redirect to All Events page or wherever you prefer
      }
    } catch (error) {
      console.error("❌ Event Creation Error:", error.response?.data || error.message);
      setMessage("❌ Failed to create event. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleCreateEvent}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <div>
          <label>Total Tickets:</label>
          <input type="number" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <button type="submit">Create Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateEvent;

import React, { useState } from "react";
import axios from "axios";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Automatically detect whether we're on localhost or deployed
  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://kit-alumni.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/user/submit`,
        { feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "✅ Feedback submitted successfully!");
      setFeedback("");
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage("❌ Error submitting feedback");
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Share Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
};

export default FeedbackForm;

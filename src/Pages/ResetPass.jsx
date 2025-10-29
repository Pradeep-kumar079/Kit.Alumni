import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPass.css";

const ResetPass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use full backend URL
      const res = await axios.post(
        `https://kit-alumni.onrender.com/api/auth/reset-password/${token}`,
        { password }
      );

      setMsg(res.data.message || "Password reset successful!");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {msg && <p className="message">{msg}</p>}
      </form>
    </div>
  );
};

export default ResetPass;

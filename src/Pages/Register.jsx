import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    usn: "",
    email: "",
    password: "",
    branch: "",
    admissionyear: "",
    role: "student",
    termsAccepted: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email before sending OTP.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://kit-alumni.onrender.com/api/user/send-otp",
        { email: formData.email }
      );
      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://kit-alumni.onrender.com/api/user/verify-otp",
        { email: formData.email, otp }
      );
      if (res.data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify your OTP before registering.");
    if (!formData.termsAccepted)
      return alert("You must agree to the terms before registering.");
    if (!formData.admissionyear || isNaN(parseInt(formData.admissionyear)))
      return alert("Enter a valid admission year.");

    try {
      setLoading(true);
      const finalData = { ...formData, admissionyear: parseInt(formData.admissionyear) };
      const res = await axios.post(
        "https://kit-alumni.onrender.com/api/user/register",
        finalData
      );
      if (res.data.success) {
        alert(`Registration successful as ${formData.role.toUpperCase()}!`);
        navigate("/login"); // ✅ stays in frontend
      } else {
        alert(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="usn"
          placeholder="USN"
          value={formData.usn}
          onChange={handleChange}
          required
        />
        <div className="email-otp-section">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="otp-btn"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="otp-btn"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="admissionyear"
          placeholder="Admission Year"
          value={formData.admissionyear}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>
        <label className="terms">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />{" "}
          I agree to the Terms & Conditions
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

import React from "react";
import { Link } from "react-router-dom";

const AcceptSuccess = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ color: "green" }}>✅ Connection Accepted!</h1>
      <p>You are now connected successfully.</p>
      <Link to="/students" style={{ color: "#007bff", textDecoration: "none" }}>
        Go back to Students
      </Link>
    </div>
  );
};

export default AcceptSuccess;

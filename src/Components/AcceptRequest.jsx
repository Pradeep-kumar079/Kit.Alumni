import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AcceptRequest = ({ refreshStudents }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const acceptRequest = async () => {
      try {
        await axios.get(`/api/student/accept-request/${token}`);
        alert("✅ Connection accepted!");
        if (refreshStudents) refreshStudents(); // update batch list in parent
        navigate("/students"); // redirect back to batches
      } catch (err) {
        console.error(err.response?.data || err);
        alert("Failed to accept request.");
        navigate("/students");
      }
    };

    acceptRequest();
  }, [token, refreshStudents, navigate]);

  return <div>Processing request...</div>;
};

export default AcceptRequest;

// src/Pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import ChatLayout from "../Components/ChatLayout";
import axios from "axios";

const ChatPage = () => {
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("/api/account", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (!user) return <div>Loading user details...</div>;

  return (
    <div>
      <Navbar />
      <ChatLayout userId={user._id} />
    </div>
  );
};

export default ChatPage;

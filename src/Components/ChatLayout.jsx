// src/Components/ChatLayout.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // backend port

const ChatLayout = ({ userId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId) socket.emit("user-online", userId);
  }, [userId]);

  useEffect(() => {
    socket.on("receive-message", ({ chat }) => {
      if (chat.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, chat]);
      }
    });

    socket.on("message-sent", ({ chat }) => {
      setMessages((prev) => [...prev, chat]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-sent");
    };
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user/all");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendMessage = () => {
    if (selectedUser && message.trim()) {
      socket.emit("send-message", {
        fromUserId: userId,
        toUserId: selectedUser._id,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <h3>All Users</h3>
        {users.map((u) => (
          <div
            key={u._id}
            className={`user ${selectedUser?._id === u._id ? "active" : ""}`}
            onClick={() => setSelectedUser(u)}
          >
            <img src={u.userimg ? `/uploads/${u.userimg}` : "/default.png"} alt="" />
            <span>{u.username}</span>
          </div>
        ))}
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h4>{selectedUser.username}</h4>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.sender === userId ? "sent" : "received"}`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">Select a user to chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;

import React from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";

const ChatWrapper = () => {
  const { otherUserId } = useParams();
  const token = localStorage.getItem("token");

  const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  if (!currentUserId) return <div>Please login to chat.</div>;

  return <Chat currentUserId={currentUserId} otherUserId={otherUserId} />;
};

export default ChatWrapper;

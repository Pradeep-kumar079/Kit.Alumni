import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { userId } = useParams(); // from route /profile/:userId
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [requestStatus, setRequestStatus] = useState("Not connected");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Decode token to get current user ID
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id);

        const res = await axios.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUser(res.data.user);
          setUserPosts(res.data.posts);

          // Determine connection status
          const isConnected = res.data.user.connections?.includes(payload.id);
          setRequestStatus(isConnected ? "Connected" : "Not connected");
        }
      } catch (err) {
        console.error(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/alumni/send-request",
        { email: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request sent!");
      setRequestStatus("Request Sent");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to send request.");
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/alumni/disconnect",
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Disconnected successfully!");
      setRequestStatus("Not connected");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to disconnect.");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.userimg ? `/uploads/${user.userimg}` : "/assets/default-profile.png"}
          alt={user.username}
          className="profile-img"
        />
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>Batch : {user.admissionyear}</p>
         <p>Connections: {user.connections?.length || 0}</p>
          <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

          <div className="profile-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {currentUserId === user._id ? (
              <span>My Profile</span>
            ) : requestStatus === "Not connected" ? (
              <button onClick={handleConnect}>Connect</button>
            ) : requestStatus === "Request Sent" ? (
              <button disabled>Request Sent</button>
            ) : requestStatus === "Connected" ? (
              <>
               {requestStatus === "Connected" && (
                  <button onClick={() => navigate(`/chat/${user._id}`)}>Message</button>
                )}
                <button
                  onClick={handleDisconnect}
                  style={{ backgroundColor: "#dc3545", color: "#fff" }}
                >
                  Disconnect
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <h3 className="section-title">Posts by {user.username}</h3>
      <div className="profile-posts">
        {userPosts.length ? (
          userPosts.map((post) => (
            <div key={post._id} className="profile-post-card">
              <h4>{post.title}</h4>
              <p>{post.description}</p>
              {post.postimg && (
                <img
                  src={`/uploads/${post.postimg}`}
                  alt="Post"
                  className="profile-post-img"
                />
              )}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllPosts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/user/allposts");
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (!posts.length) return <div>No posts available</div>;

  // Navigate to single post
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Navigate to user profile
  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Like functionality
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/user/like/${postId}`);
      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: res.data.updatedLikes } : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Comment functionality
  const handleComment = async (postId, commentText) => {
    if (!commentText) return;
    try {
      const res = await axios.post(`/api/user/comment/${postId}`, { comment: commentText });
      if (res.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, comments: res.data.updatedComments } : post
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Share functionality
  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="all-post-container">
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {/* Post Header */}
            {/* Post Header */}
            <div className="post-header">
              <div
                className="userprof"
                onClick={() => handleProfileClick(post.user._id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    post.user.userimg
                      ? `/uploads/${post.user.userimg}`
                      : "/assets/default-profile.png"
                  }
                  alt={post.user.username}
                  className="post-profile-img"
                />
              </div>

              <div
                onClick={() => handleProfileClick(post.user._id)}
                style={{ cursor: "pointer" }}
              >
               <h4 className="post-username">
                  {post.user.username}
                  {/* <span className="user-role">
                    {" "}
                    ({post.user.role === "admin"
                      ? "Admin"
                      : post.user.role === "alumni"
                      ? "Alumni"
                      : post.user.role === "student"
                      ? "Student"
                      : "User"})
                  </span> */}
                </h4>

                <small>{new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </div>


            {/* Post Content */}
            <div
              className="post-content"
              onClick={() => handlePostClick(post._id)}
              style={{ cursor: "pointer" }}
            >
              {post.title && <h3>{post.title}</h3>}
             
              {post.postimg && (
                <img
                  src={`http://localhost:5000/uploads/${post.postimg}`}
                  alt="Post"
                  className="post-img"
                />
              )}

               {post.description && <p>{post.description}</p>}
            </div>

            {/* Post Details */}
            <div className="post-details">
              <small>Category: {post.category || "General"}</small>
              {post.hashtags?.length > 0 && (
                <div className="hashtags">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="hashtag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <small>Likes: {post.likes?.length || 0}</small>
              <small>Comments: {post.comments?.length || 0}</small>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <button onClick={() => handleLike(post._id)}> Like</button>
              <button
                onClick={() => {
                  const commentText = prompt("Enter your comment:");
                  handleComment(post._id, commentText);
                }}
              >
                 Comment
              </button>
              <button onClick={() => handleShare(post._id)}>🔗 Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./SinglePost.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  // ✅ Set authorization header if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ✅ Fetch post + comments
  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/user/post/${id}`);
      if (res.data.success) {
        setPost(res.data.post);
        setComments(res.data.post.comments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // ✅ Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to comment");
      return;
    }

    if (!comment.trim()) return;

    try {
      const res = await axios.post(`/api/user/comment/${id}`, { comment });
      if (res.data.success) {
        setComments(res.data.updatedComments);
        setComment("");
      } else {
        alert(res.data.message || "Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error posting comment");
    }
  };

  if (!post) return <div>Loading post...</div>;

  return (
    <div className="single-post-container">
      <div className="single-post">
        <h2>{post.title}</h2>
        <p>{post.description}</p>

        {post.postimg && (
          <img
            src={`http://localhost:5000/uploads/${post.postimg}`}
            alt="Post"
            className="post-image"
          />
        )}

        <div className="actions">
          <span>👍 Likes: {post.likes?.length || 0}</span>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Post Comment</button>
          </form>

          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((c, idx) => (
                <div key={idx} className="comment">
                  <strong>{c.username || "Anonymous"}:</strong> {c.text}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

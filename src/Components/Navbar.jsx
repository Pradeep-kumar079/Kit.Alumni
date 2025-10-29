import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { FaGraduationCap, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔍 Search function
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(`/api/search?q=${query}`);
        if (res.data.success) {
          const combined = [
            ...res.data.users.map((u) => ({ ...u, type: "user" })),
            ...res.data.posts.map((p) => ({ ...p, type: "post" })),
          ];
          setResults(combined);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const delay = setTimeout(fetchResults, 400); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (item) => {
    setQuery("");
    setResults([]);
    if (item.type === "user") navigate(`/profile/${item._id}`);
    else navigate(`/post/${item._id}`);
  };

  return (
    <div className="navbar-wrapper">
      <div className="container">
        <div className="logo">
          <h2>Logo</h2>
        </div>

        <div className="search">
          <FaMagnifyingGlass />
          <input
            type="text"
            placeholder="Search users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="search-item"
                  onClick={() => handleSelect(item)}
                >
                  {item.type === "user" ? (
                    <>
                      <img
                        src={
                          item.userimg
                            ? `/uploads/${item.userimg}`
                            : "/assets/default-profile.png"
                        }
                        alt={item.username}
                        className="search-img"
                      />
                      <div className="search-info">
                        <strong>{item.username}</strong>
                        <small>
                          {item.usn} · {item.batch} · {item.role}
                        </small>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={
                          item.postimg
                            ? `/uploads/${item.postimg}`
                            : "/assets/default-post.png"
                        }
                        alt={item.title}
                        className="search-img"
                      />
                      <div className="search-info">
                        <strong>{item.title}</strong>
                        <small>{item.category}</small>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="buttons">
          <button><Link to={'/home'}>Home</Link></button>
          <button><Link to={'/about'}>About</Link></button>
          <button><Link to={'/post'}>Post</Link></button>
          <button><Link to={'/students'}><FaUser /> Students</Link></button>
          <button><Link to={'/alumni'}><FaGraduationCap /> Alumni</Link></button>
          <button><Link to={'/account'}>Account</Link></button>
          <button className="logout" onClick={Logout}><FaSignOutAlt /> Log out</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

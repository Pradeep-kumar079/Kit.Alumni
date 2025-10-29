import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section about">
          <h2>Answerme</h2>
          <p>
            Connecting students and alumni to share knowledge, opportunities, and experiences.
          </p>
        </div>

        {/* Center Section */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/post">Posts</a></li>
             <li><a href="/account">Account</a></li>
             
          </ul>
          

        </div>

        <div className="footer-section links">
          <h3>Importants</h3>
          <ul>
             <li><a href="/student">Students</a></li>
            <li><a href="/alumni">Alumni</a></li>
            <li><a href="/login">Admin</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: kitalumni26@gmail.com</p>
          <p>Phone: +91 93531 98519</p>
          <div className="social-icons">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Answerme. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

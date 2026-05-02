import React from 'react';

const Navbar = ({ isVisible, user, onLoginClick, onAvatarClick }) => {
  return (
    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
      <div className="navbar-logo">EE <span>Labs</span></div>
      <div className="navbar-links">
        <a href="#semesters">Semesters</a>
        <a href="https://bitmesra.ac.in/edudepartment/1/71" target="_blank" rel="noreferrer">Resources</a>
        <a href="#about-section">About</a>
        {/* Added Login Button to Navbar */}
        {user ? (
          <div className="navbar-avatar" title={user.name} onClick={onAvatarClick}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <button className="navbar-login-btn" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
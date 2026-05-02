// src/components/Hero.js
import React from 'react';
import collegeLogo from '../assets/bitlogo.png'; 

const Hero = ({ onStartExploring, user, onLoginClick, onAvatarClick}) => {
  return (
    <div className="hero-section">

      {/* Top Left: College Info */}
      <div className="college-info">
        <img src={collegeLogo} alt="College Logo" className="college-logo" />
        <div className="college-text">
          <p className="college-name">BIRLA INSTITUTE OF TECHNOLOGY</p>
          <p className="college-address">MESRA, RANCHI, INDIA, 835215</p>
        </div>
      </div>

      {/* Top Right: Login Button */}
      {user ? (
        <div className="user-avatar-top" title={user.name} onClick={onAvatarClick}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      ) : (
        <button className="login-btn-top" onClick={onLoginClick}>
          Login
        </button>
      )}

      {/* Center Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Electrical <span>Engineering</span>
        </h1>
        <h2 className="hero-subtitle">Laboratory Experiments</h2>
        <p className="hero-description">
          Comprehensive collection of electrical engineering experiments spanning 8
          semesters. Explore hands-on learning with detailed procedures, safety
          guidelines, and practical applications.
        </p>
        
        {/* THE BUTTON IS BACK! */}
        <button className="hero-button" onClick={onStartExploring}>
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default Hero;
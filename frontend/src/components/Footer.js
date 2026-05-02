import React from 'react';

// --- SVG Icons for "Why Choose" Section ---
const MonitorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
);

const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path>
    </svg>
);

// --- SVG Icons for Social Links ---
const GithubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = () => {
  return (
    <footer id="about-section" className="site-footer">
      <div className="footer-content">
        <div className="footer-section why-choose">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">A Production-Grade Platform</h2>
          </div>
          <div className="footer-cards">
            
            <div className="footer-card">
              <div className="footer-card-icon">
                <MonitorIcon />
              </div>
              <h4>Interactive Virtual Labs</h4>
              <p>Dynamic observation tables with auto-saving, real-time formula calculations, and embedded circuit simulators.</p>
            </div>
            
            <div className="footer-card">
              <div className="footer-card-icon">
                <TimerIcon />
              </div>
              <h4>Live Exam Engine</h4>
              <p>Strict time-bound assessments with anti-cheat auto-submission, delayed grading, and one-attempt locks.</p>
            </div>
            
            <div className="footer-card">
              <div className="footer-card-icon">
                <ShieldCheckIcon />
              </div>
              <h4>Enterprise Security</h4>
              <p>Protected by JWT authentication, SHA-256 hashing, OTP email verification, and strict role-based route guarding.</p>
            </div>

          </div>
        </div>
        
        <div className="footer-section footer-about" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid #eee' }}>
          <h3 className="footer-title">About the Creator</h3>
          <p style={{ lineHeight: '1.8', color: '#555' }}>
            Hi, I'm Abdul Ahad Syed. I built EE Labs as a comprehensive Learning Management System combining a React frontend with a secure Spring Boot & PostgreSQL backend. It bridges the gap between theoretical learning and practical execution, providing a modern, accessible experience for engineering students.
          </p>
          <div className="footer-social-links" style={{ marginTop: '1.5rem' }}>
            <a href="https://github.com/Ahad287" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon /></a>
            <a href="https://www.linkedin.com/in/abdul-ahad-1771191a0" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} EE Labs. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
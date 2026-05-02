import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import TeacherDashboard from './components/TeacherDashboard';
import ProfileSettings from './components/ProfileSettings';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null); // null = not logged in
  const [view, setView] = useState('semesters'); // 'semesters', 'experiments', 'detail'
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [activeView, setActiveView] = useState('home');
 
  const mainContentRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Decode the JWT without a library by parsing the middle string (payload)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        
        // Rebuild the user state from the token data!
        setUser({
          name: decodedToken.name,
          email: decodedToken.sub,
          role: decodedToken.role
        });
      } catch (e) {
        console.error("Invalid token found");
        localStorage.removeItem('jwt_token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false); // Close modal on success
  };

  const handleLogout = () => {
    setUser(null);
    setIsMenuOpen(false);
    setActiveView('home'); 
    localStorage.removeItem('jwt_token');
  };

  // Show Navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsNavVisible(true);
      } else {
        setIsNavVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartExploring = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSelectSemester = (id) => {
    setSelectedSemester(id);
    setView('experiments');
    window.scrollTo({ top: mainContentRef.current.offsetTop - 80, behavior: 'smooth' });
  };
  
  // THIS IS THE CORRECTED FUNCTION
  const handleSelectExperiment = (id) => {
    setSelectedExperiment(id);
    setView('detail');
    // The line that caused the scroll to the top has been removed.
  };

  const handleBackToSemesters = () => {
    setView('semesters');
    setSelectedSemester(null);
  };
  
  const handleBackToExperiments = () => {
    setView('experiments');
    setSelectedExperiment(null);
    window.scrollTo({ top: mainContentRef.current.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Navbar 
        isVisible={isNavVisible} 
        user={user} 
        onLoginClick={() => setIsAuthOpen(true)}
        onAvatarClick={() => setIsMenuOpen(true)}
      />
      
      <Hero 
        onStartExploring={() => {
          const el = document.getElementById('semesters');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} 
        user={user} 
        onLoginClick={() => setIsAuthOpen(true)}
        onAvatarClick={() => setIsMenuOpen(true)}
      />

      {/* Conditionally render MainContent (WITH PROPS) or TeacherDashboard */}
      {/* SECURED ROUTE GUARDS */}
      <div ref={mainContentRef}>
        {activeView === 'home' ? (
          <MainContent 
            view={view}
            semesterId={selectedSemester}
            experimentId={selectedExperiment}
            onSelectSemester={handleSelectSemester}
            onSelectExperiment={handleSelectExperiment}
            onBackToSemesters={handleBackToSemesters}
            onBackToExperiments={handleBackToExperiments}
          />
        ) : activeView === 'teacher-dashboard' ? (
          
          // GUARD 1: STRICT TEACHER CHECK
          // GUARD 1: ALLOW TEACHER OR ADMIN
          (user?.role === 'teacher' || user?.role === 'admin') ? (
            <TeacherDashboard user={user} /> // <-- Pass the user prop!
          ) : (
            <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
              <h2 style={{ color: '#dc2626' }}>⛔ Unauthorized Access</h2>
              <p>You do not have administrator privileges to view the Command Center.</p>
              <button className="hero-button" onClick={() => setActiveView('home')}>Return to Safety</button>
            </div>
          )

        ) : activeView === 'profile' ? (
          
          // GUARD 2: MUST BE LOGGED IN
          user ? <ProfileSettings user={user} /> : (
            <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>Please log in to view profile settings.</div>
          )

        ) : activeView === 'student-dashboard' ? (
          
          // GUARD 3: STRICT STUDENT CHECK
          user?.role === 'student' ? (
            <StudentDashboard />
          ) : (
            <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
              <h2 style={{ color: '#dc2626' }}>⛔ Student Portal</h2>
              <p>This area is restricted to enrolled students only.</p>
              <button className="hero-button" onClick={() => setActiveView('home')}>Return to Safety</button>
            </div>
          )

        ) : null}
      </div>

      {/* The Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SINGLE UserMenu with ALL props attached */}
      <UserMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        user={user} 
        onLogout={handleLogout}
        onNavigate={(view) => {
          setActiveView(view);
          setIsMenuOpen(false); // Close menu after clicking
        }}
      />
    </div>
  );
}

export default App;
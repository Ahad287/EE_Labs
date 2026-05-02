import React from 'react';

const UserMenu = ({ isOpen, onClose, user, onLogout, onNavigate }) => {
  if (!user) return null;

  return (
    <>
      {/* The dark, blurry background overlay */}
      <div 
        className={`user-menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>

      {/* The sliding drawer */}
      <div className={`user-menu-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Menu Header */}
        <div className="menu-header">
          <div className="menu-profile-pic">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="menu-user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`menu-role-badge ${user.role}`}>
              {user.role === 'teacher' ? '👨‍🏫 Teacher' : `🎓 Semester ${user.semester}`}
            </span>
          </div>
          <button className="menu-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Menu Links */}
        <div className="menu-links">
          <div className="menu-category">Navigation</div>
          
          {/* Universal Home Button */}
          <button className="menu-item" onClick={() => onNavigate('home')}>
            🏠 Experiments (Home)
          </button>

          {/* Teacher Specific */}
          {/* Teacher & Admin Command Center */}
          {(user.role === 'teacher' || user.role === 'admin') && (
            <button className="menu-item" onClick={() => onNavigate('teacher-dashboard')}>
              🎛️ {user.role === 'admin' ? 'Admin Command Center' : 'Teacher Command Center'}
            </button>
          )}

          {/* Student Specific */}
          {user.role === 'student' && (
            <button className="menu-item" onClick={() => onNavigate('student-dashboard')}>
              📈 My Progress & Analytics
            </button>
          )}

          {/* Universal Settings */}
          <div className="menu-category">Account</div>
          <button className="menu-item" onClick={() => onNavigate('profile')}>
            ⚙️ Profile Settings
          </button>
        </div>

        {/* Logout Footer */}
        <div className="menu-footer">
          <button className="menu-logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
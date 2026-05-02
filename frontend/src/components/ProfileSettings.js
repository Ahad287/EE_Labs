import React, { useState } from 'react';
import axios from 'axios';

const ProfileSettings = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('jwt_token');
  
  // Determine the correct API endpoint based on role
  const apiBase = user.role === 'teacher' ? '/api/teacher' : '/api/student';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(''); // clear old messages
    try {
      const payload = { name };
      if (password) payload.password = password;
      if (user.role === 'student') payload.semester = semester;

      await axios.put(`http://localhost:8080${apiBase}/profile`, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setMessage('Profile updated successfully! Log out and back in to see changes.');
      setPassword(''); 
    } catch (err) { 
      // NEW: Dynamically catch the 60-day rule error from Java
      const errorMessage = err.response?.data?.error || 'Failed to update profile.';
      setMessage(`❌ ${errorMessage}`); 
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to delete your account? All your past observations and quiz scores will be permanently lost."
    );
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080${apiBase}/account`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Account deleted.");
        localStorage.removeItem('jwt_token');
        window.location.href = '/'; // Kick them out to the login screen
      } catch (err) {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '6rem 5%', maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="section-title" style={{ textAlign: 'center' }}>Account Settings</h2>
      
      {message && <div style={{ padding: '1rem', background: '#e0f2fe', color: '#0284c7', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

      <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px', border: '1px solid #ddd' }}>
        <form onSubmit={handleUpdateProfile}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Email Address (Unchangeable)</label>
          <input type="email" className="table-input" style={{ border: '1px solid #ccc', marginBottom: '1.5rem', background: '#eee', color: '#888' }} value={user.email} disabled />

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Update Display Name</label>
          <input type="text" className="table-input" style={{ border: '1px solid #ccc', marginBottom: '1.5rem' }} value={name} onChange={e => setName(e.target.value)} required />

          {/* STUDENT ONLY: Semester Dropdown */}
          {user.role === 'student' && (
            <>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Current Semester</label>
              <select className="table-input" style={{ border: '1px solid #ccc', marginBottom: '1.5rem', backgroundColor: 'white' }} value={semester} onChange={e => setSemester(e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num}</option>)}
              </select>
            </>
          )}

          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>New Password (leave blank to keep current)</label>
          <input type="password" className="table-input" style={{ border: '1px solid #ccc', marginBottom: '2rem' }} placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} />
          
          <button type="submit" className="hero-button" style={{ width: '100%', margin: 0 }}>Save Profile Changes</button>
        </form>

        {/* DANGER ZONE */}
        {user.role === 'student' && (
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px dashed #fca5a5', textAlign: 'center' }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 1rem 0' }}>Danger Zone</h4>
            <button onClick={handleDeleteAccount} style={{ padding: '10px 20px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #f87171', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
              Delete My Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
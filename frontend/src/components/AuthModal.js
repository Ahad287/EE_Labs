import React, { useState } from 'react';
import axios from 'axios';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [needsGoogleReg, setNeedsGoogleReg] = useState(false);
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [semester, setSemester] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Google specific states
  const [pendingGoogleToken, setPendingGoogleToken] = useState('');
  const [pendingName, setPendingName] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- STANDARD INPUT STYLE ---
  const inputStyle = { width: '100%', padding: '12px 15px', margin: '0 0 1rem 0', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', transition: 'border-color 0.2s' };

  // --- NEW: THE PREMIUM, STYLISH BUTTON STYLE ---
  const premiumButtonStyle = {
    width: '100%',
    margin: '0.5rem 0',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Subtle premium gradient
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 6px 16px rgba(220, 38, 38, 0.2)', // Red-tinged shadow for depth
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)', // Better readability
  };

  // Helper for when a user hovers or is disabled
  const buttonStateStyle = (loading, isSlate = false) => {
    if (loading) {
      return { ...premiumButtonStyle, background: '#cbd5e1', color: '#94a3b8', boxShadow: 'none', cursor: 'not-allowed' };
    }
    // We add a hover effect here using state is not trivial, so we rely on the premiumButtonStyle's transition
    return premiumButtonStyle;
  };

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setRole('student'); setSemester(1);
    setOtp(''); setOtpSent(false); setError(''); setMessage(''); setIsForgotPassword(false); setNeedsGoogleReg(false);
  };

  const switchMode = (mode) => {
    resetForm();
    if (mode === 'login') setIsLogin(true);
    else if (mode === 'signup') setIsLogin(false);
    else if (mode === 'forgot') { setIsLogin(false); setIsForgotPassword(true); }
  };

  const decodeAndLogin = (token, userFallback) => {
    localStorage.setItem('jwt_token', token);
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      onLoginSuccess({ name: decoded.name, email: decoded.sub, role: decoded.role, semester: decoded.semester });
    } catch {
      onLoginSuccess({ name: userFallback.name, email: userFallback.email, role: userFallback.role, semester: userFallback.semester });
    }
    resetForm();
  };

  // --- GOOGLE SSO LOGIC ---
  const handleGoogleAuth = async () => {
    setLoading(true); setError(''); setMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data, status } = await axios.post('http://localhost:8080/api/auth/google', { idToken }, { validateStatus: s => [200, 202, 403].includes(s) });

      if (status === 200) decodeAndLogin(data.token, data.user);
      else if (status === 202) {
        setPendingGoogleToken(idToken);
        setPendingName(data.name);
        setNeedsGoogleReg(true);
      } else if (status === 403) setError(data.error);
    } catch (err) {
      setError(err.response?.data?.error || "Google Authentication Failed. Check your configuration.");
    } finally { setLoading(false); }
  };

  const handleCompleteGoogleReg = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/google/register', { idToken: pendingGoogleToken, role, semester });
      if (data.token) decodeAndLogin(data.token, data.user);
      else {
        setMessage(data.message);
        setTimeout(() => { onClose(); resetForm(); }, 3000);
      }
    } catch (err) { setError(err.response?.data?.error || "Registration Failed."); } 
    finally { setLoading(false); }
  };

  // --- STANDARD LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      decodeAndLogin(data.token, data.user);
    } catch (err) { setError(err.response?.data?.error || "Login failed."); } 
    finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!email) { setError("Please enter an email address."); return; }
    setLoading(true); setError(''); setMessage('');
    const endpoint = isForgotPassword ? '/api/auth/forgot-password/send-otp' : '/api/auth/send-otp';
    try {
      await axios.post(`http://localhost:8080${endpoint}`, { email });
      setOtpSent(true);
      setMessage("A 6-digit code has been sent to your email!");
    } catch (err) { setError(err.response?.data?.error || "Failed to send OTP."); } 
    finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/register', { name, email, password, role, semester, otp });
      setMessage("Registration successful! You can now log in.");
      setTimeout(() => switchMode('login'), 2000);
    } catch (err) { setError(err.response?.data?.error || "Registration failed."); } 
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password/reset', { email, otp, newPassword: password });
      setMessage("Password updated! Please log in.");
      setTimeout(() => switchMode('login'), 2000);
    } catch (err) { setError(err.response?.data?.error || "Failed to reset password."); } 
    finally { setLoading(false); }
  };

  // --- RENDER COMPONENTS ---
  const Divider = () => (
    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
      <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>OR</span>
      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
    </div>
  );

  const GoogleBtn = ({ text }) => (
    <button type="button" onClick={handleGoogleAuth} disabled={loading} style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: '#333', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '20px' }} />
      {text}
    </button>
  );

  return (
    <div className="auth-modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="auth-modal" onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
        
        <h2 style={{ marginBottom: '1.5rem', color: '#dc2626', textAlign: 'center' }}>
          {needsGoogleReg ? 'Complete Profile' : isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

        {/* VIEW 1: GOOGLE REGISTRATION COMPLETION */}
        {needsGoogleReg ? (
          <form onSubmit={handleCompleteGoogleReg}>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>Welcome, {pendingName}!</p>
            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {role === 'student' && (
              <select style={inputStyle} value={semester} onChange={(e) => setSemester(e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>Semester {num}</option>)}
              </select>
            )}
            <button type="submit" style={buttonStateStyle(loading)} disabled={loading}>Finish Setup</button>
          </form>
        ) : (
          <form onSubmit={isForgotPassword ? handleResetPassword : isLogin ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* GOOGLE BUTTONS ON TOP FOR LOGIN/SIGNUP */}
            {!isForgotPassword && !otpSent && (
              <>
                <GoogleBtn text={isLogin ? "Sign in with Google" : "Sign up with Google"} />
                <Divider />
              </>
            )}

            {/* EMAIL INPUT (Always visible) */}
            <input type="email" placeholder="College Email (@bitmesra.ac.in)" style={{ ...inputStyle, backgroundColor: (otpSent && !isLogin) ? '#f8fafc' : '#fff' }} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpSent && !isLogin} />

            {/* LOGIN MODE */}
            {isLogin && !isForgotPassword && (
              <>
                <input type="password" placeholder="Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" style={buttonStateStyle(loading)} disabled={loading}>{loading ? 'Logging in...' : 'Login with Email'}</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.85rem' }}>
                  <span onClick={() => switchMode('forgot')} style={{ color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>Forgot Password?</span>
                  <span onClick={() => switchMode('signup')} style={{ color: '#666', cursor: 'pointer' }}>New user? Register</span>
                </div>
              </>
            )}

            {/* SIGNUP MODE */}
            {!isLogin && !isForgotPassword && (
              <>
                {!otpSent ? (
                  <>
                    <input type="text" placeholder="Full Name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                      <select style={{ ...inputStyle, margin: 0, flex: 1 }} value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                      {role === 'student' && (
                        <select style={{ ...inputStyle, margin: 0, flex: 1 }} value={semester} onChange={(e) => setSemester(e.target.value)}>
                          {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>Semester {num}</option>)}
                        </select>
                      )}
                    </div>
                    <button type="button" style={buttonStateStyle(loading)} onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP Code'}</button>
                  </>
                ) : (
                  <>
                    <input type="text" placeholder="Enter 6-digit OTP" style={{...inputStyle, letterSpacing: '3px', textAlign: 'center', fontWeight: 'bold' }} value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <input type="password" placeholder="Create Password (min. 8 chars)" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" style={buttonStateStyle(loading)} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Register'}</button>
                  </>
                )}
                <p onClick={() => switchMode('login')} style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#666', cursor: 'pointer' }}>Already have an account? Login</p>
              </>
            )}

            {/* FORGOT PASSWORD MODE */}
            {isForgotPassword && (
              <>
                {!otpSent ? (
                  <button type="button" style={buttonStateStyle(loading)} onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send Reset OTP'}</button>
                ) : (
                  <>
                    <input type="text" placeholder="Enter 6-digit OTP" style={{...inputStyle, letterSpacing: '3px', textAlign: 'center', fontWeight: 'bold' }} value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <input type="password" placeholder="Enter New Password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" style={buttonStateStyle(loading)} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                  </>
                )}
                <p onClick={() => switchMode('login')} style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#666', cursor: 'pointer' }}>Back to Login</p>
              </>
            )}

          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
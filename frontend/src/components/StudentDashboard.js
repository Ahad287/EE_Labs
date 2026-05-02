import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('observations'); 
  const [submissions, setSubmissions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [liveTime, setLiveTime] = useState(new Date());

  const [examSession, setExamSession] = useState(null); 
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examTimeRemaining, setExamTimeRemaining] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const answersRef = useRef({});
  const token = localStorage.getItem('jwt_token');

  // Dashboard ticking clock
  useEffect(() => {
    if (!examSession) {
      const timer = setInterval(() => setLiveTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [examSession]);

  // Exam Room ticking clock & Auto-Submit logic
  useEffect(() => {
    if (examSession && !isSubmitting) {
      const timer = setInterval(() => {
        const end = new Date(examSession.startTime).getTime() + (examSession.durationMinutes * 60000);
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
          clearInterval(timer);
          executeSubmitQuiz(); // AUTO SUBMIT TRIGGER
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setExamTimeRemaining(`${m}:${s < 10 ? '0' : ''}${s}`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examSession, isSubmitting]);

  // Data Fetchers
  useEffect(() => {
    if (activeTab === 'observations') fetchMySubmissions();
    if (activeTab === 'quizzes') {
      fetchActiveQuizzes();
      fetchMyScores(); // Fetch scores too, so we know which quizzes are already submitted!
    }
    if (activeTab === 'scores') fetchMyScores();
  }, [activeTab]);

  const fetchMySubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/student/submissions', { headers: { Authorization: `Bearer ${token}` } });
      setSubmissions(data);
    } catch (err) { setError('Failed to load observations.'); } finally { setLoading(false); }
  };

  const fetchActiveQuizzes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/student/active-quizzes', { headers: { Authorization: `Bearer ${token}` } });
      setQuizzes(data);
    } catch (err) { setError("Failed to load quizzes"); } finally { setLoading(false); }
  };

  const fetchMyScores = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/student/my-scores', { headers: { Authorization: `Bearer ${token}` } });
      setScores(data);
    } catch (err) { setError("Failed to load scores"); } finally { setLoading(false); }
  };

  // --- EXAM ACTIONS ---
  const enterExamRoom = (quiz) => {
    let parsedQuestions = [];
    try { parsedQuestions = JSON.parse(quiz.questions); } catch (e) { parsedQuestions = []; }
    
    // RULE 3: Auto-Resume! Check localStorage to see if they were already taking this quiz.
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz_${quiz.id}_answers`)) || {};
    
    setExamQuestions(parsedQuestions);
    setExamSession(quiz);
    setAnswers(savedAnswers);
    answersRef.current = savedAnswers;
  };

  const handleSelectOption = (qIndex, option) => {
    const newAnswers = { ...answers, [qIndex]: option };
    setAnswers(newAnswers);
    answersRef.current = newAnswers; 
    
    // RULE 3: Auto-Save every click directly to the browser storage
    localStorage.setItem(`quiz_${examSession.id}_answers`, JSON.stringify(newAnswers));
  };

  const executeSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/student/submit-quiz/${examSession.id}`, answersRef.current, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // RULE 1: Change popup to hide the score
      alert("Quiz Submitted Successfully!\nYour score will be revealed in the 'My Grades' tab once the quiz duration ends for all students.");
      
      // Clear the auto-save cache
      localStorage.removeItem(`quiz_${examSession.id}_answers`);
      
      setExamSession(null);
      setActiveTab('scores'); 
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuizStatus = (quiz) => {
    const startTime = new Date(quiz.startTime);
    const endTime = new Date(startTime.getTime() + quiz.durationMinutes * 60000);
    if (liveTime < startTime) {
      const diffMs = startTime - liveTime;
      const hours = Math.floor(diffMs / 3600000); const mins = Math.floor((diffMs % 3600000) / 60000); const secs = Math.floor((diffMs % 60000) / 1000);
      return { state: 'upcoming', text: `Starts in: ${hours}h ${mins}m ${secs}s`, color: '#d97706', bg: '#fef3c7' };
    } else if (liveTime >= startTime && liveTime <= endTime) {
      const diffMs = endTime - liveTime; const mins = Math.floor(diffMs / 60000); const secs = Math.floor((diffMs % 60000) / 1000);
      return { state: 'active', text: `ACTIVE NOW (Closes in ${mins}m ${secs}s)`, color: '#16a34a', bg: '#dcfce7' };
    } else {
      return { state: 'expired', text: 'Quiz Ended', color: '#dc2626', bg: '#fee2e2' };
    }
  };

  // ==========================================
  // RENDER: EXAM ROOM MODE
  // ==========================================
  if (examSession) {
    return (
      <div style={{ padding: '2rem 5%', maxWidth: '900px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ position: 'sticky', top: '10px', background: '#dc2626', color: 'white', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(220,38,38,0.3)', zIndex: 100, marginBottom: '2rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{examSession.title}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Your answers are being auto-saved.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Remaining</p>
            <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'monospace' }}>{examTimeRemaining}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5rem' }}>
          {examQuestions.map((q, qIdx) => (
            <div key={qIdx} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #ddd' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#333' }}>
                <span style={{ color: 'var(--accent-color)', marginRight: '10px' }}>Q{qIdx + 1}.</span> {q.question}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', background: answers[qIdx] === opt ? '#eff6ff' : 'white', transition: 'all 0.2s' }}>
                    <input type="radio" name={`question-${qIdx}`} value={opt} checked={answers[qIdx] === opt} onChange={() => handleSelectOption(qIdx, opt)} style={{ transform: 'scale(1.2)' }} />
                    <span style={{ fontSize: '1rem', color: answers[qIdx] === opt ? '#1d4ed8' : '#555', fontWeight: answers[qIdx] === opt ? '600' : 'normal' }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '1.5rem', borderTop: '1px solid #ddd', textAlign: 'center', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
          <button className="hero-button" onClick={() => { if(window.confirm("Are you sure you want to submit? You cannot change your answers later.")) executeSubmitQuiz() }} style={{ padding: '15px 40px', fontSize: '1.1rem', margin: 0 }}>
            Submit Quiz Now
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: NORMAL DASHBOARD
  // ==========================================
  return (
    <div className="student-dashboard" style={{ padding: '6rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="section-title">My Academic Dashboard</h2>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', marginBottom: '2rem', overflowX: 'auto' }}>
        {['observations', 'quizzes', 'scores'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap', color: activeTab === tab ? 'var(--accent-color)' : '#666', borderBottom: activeTab === tab ? '3px solid var(--accent-color)' : '3px solid transparent', transition: 'all 0.2s' }}>
            {tab === 'observations' && '📖 Past Observations'}
            {tab === 'quizzes' && '🎯 Active Quizzes'}
            {tab === 'scores' && '📈 My Grades'}
          </button>
        ))}
      </div>

      {error && <div className="auth-error-banner">{error}</div>}
      {loading && <p>Loading data...</p>}

      {/* --- TAB 1: OBSERVATIONS --- */}
      {activeTab === 'observations' && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {submissions.length === 0 ? (
            <p>You haven't submitted any lab observations yet!</p>
          ) : (
            submissions.map((sub) => (
              <div key={sub.submissionId} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div><h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-color)' }}>Experiment ID: {sub.experimentId}</h3><p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Semester {sub.semester}</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{new Date(sub.submittedAt).toLocaleString()}</p></div>
                </div>
                <div className="table-responsive">
                  <table className="lab-table" style={{ marginTop: '1rem' }}>
                    <thead><tr>{sub.observationData.columns.map((col, idx) => <th key={idx}>{col.name} {col.isCalculated ? ' (ƒ)' : ''}</th>)}</tr></thead>
                    <tbody>{sub.observationData.data.map((row, rowIdx) => <tr key={rowIdx}>{sub.observationData.columns.map((col, colIdx) => <td key={colIdx} style={{ color: col.isCalculated ? 'var(--accent-color)' : '#444', fontWeight: col.isCalculated ? 'bold' : 'normal' }}>{row[col.name] !== undefined ? row[col.name] : '-'}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: ACTIVE QUIZZES --- */}
      {activeTab === 'quizzes' && !loading && (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {quizzes.length === 0 ? (
            <p>No quizzes scheduled for your semester currently.</p>
          ) : (
            quizzes.map((quiz) => {
              const status = getQuizStatus(quiz);
              
              // RULE 2: Check if student already submitted this quiz
              const hasSubmitted = scores.some(s => s.quizId === quiz.id);

              return (
                <div key={quiz.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: status.bg, color: status.color, padding: '8px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', alignSelf: 'flex-start', marginBottom: '1rem', border: `1px solid ${status.color}40` }}>{status.text}</div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{quiz.title}</h3>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    📅 {new Date(quiz.startTime).toLocaleDateString()} at {new Date(quiz.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} <br/>
                    ⏳ Duration: {quiz.durationMinutes} minutes
                  </p>
                  
                  {/* Button Rendering Logic based on Submission & Time Status */}
                  {hasSubmitted ? (
                    <button className="hero-button" disabled style={{ marginTop: 'auto', width: '100%', background: '#f8fafc', color: '#94a3b8', border: '1px solid #cbd5e1' }}>Already Submitted ✔️</button>
                  ) : status.state === 'active' ? (
                    <button className="hero-button" onClick={() => enterExamRoom(quiz)} style={{ marginTop: 'auto', width: '100%' }}>Enter Exam Room</button>
                  ) : status.state === 'upcoming' ? (
                    <button className="hero-button" disabled style={{ marginTop: 'auto', width: '100%', background: '#ccc', cursor: 'not-allowed' }}>Locked (Waiting for Start Time...)</button>
                  ) : (
                    <button className="hero-button" disabled style={{ marginTop: 'auto', width: '100%', background: '#fee2e2', color: '#dc2626', border: '1px solid #f87171' }}>Submissions Closed</button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- TAB 3: MY GRADES --- */}
      {activeTab === 'scores' && !loading && (
        <div className="table-responsive">
          <table className="lab-table">
            <thead><tr><th>Quiz Title</th><th>Status / Score</th><th>Date Taken</th></tr></thead>
            <tbody>
              {scores.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>You haven't completed any quizzes yet.</td></tr>
              ) : (
                scores.map(score => {
                  // RULE 1: Check if the quiz is still actively running globally
                  const isQuizStillActive = liveTime < new Date(score.quizEndTime);

                  return (
                    <tr key={score.id}>
                      <td><strong>{score.quizTitle}</strong></td>
                      <td>
                        {isQuizStillActive ? (
                          <span style={{ color: '#d97706', fontStyle: 'italic', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                            ⏳ Pending (Quiz still open)
                          </span>
                        ) : (
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: (score.score / score.total) >= 0.8 ? '#16a34a' : (score.score / score.total) < 0.5 ? '#dc2626' : '#ea580c' }}>
                            {score.score} / {score.total}
                          </span>
                        )}
                      </td>
                      <td>{score.date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
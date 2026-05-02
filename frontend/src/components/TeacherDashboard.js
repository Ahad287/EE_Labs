import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('submissions'); 
// ... existing states ...
  const [pendingTeachers, setPendingTeachers] = useState([]); // NEW
  
  // States
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [experiments, setExperiments] = useState([]); 
  const [quizScores, setQuizScores] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [semesterFilter, setSemesterFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [studentSemesterFilter, setStudentSemesterFilter] = useState('');
  const [scoresSemesterFilter, setScoresSemesterFilter] = useState(''); 
  const [scoresDateFilter, setScoresDateFilter] = useState(''); 

  // Quiz Engine States
  const [quizMode, setQuizMode] = useState('select'); 
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiSemesterId, setAiSemesterId] = useState(1); // <--- ADD THIS LINE
  const [manualQuiz, setManualQuiz] = useState({ semesterId: '1', title: '', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }] });

  // --- NEW: ADVANCED EXPERIMENT MANAGER STATES ---
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);

  // NEW: Scheduling States
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '', duration: 10, targetSemester: 1 });
  
  const initialExpForm = { 
    title: '', semester: 1, difficulty: 'Basic', duration: '2 hours', teamSize: 4, 
    summary: '', description: '', simulatorUrl: '', imageUrl: '',
    learningObjectives: [''], 
    observationColumns: ['S. No.', 'Voltage (V)', 'Current (I)'],
    procedureSteps: [''], 
    safetyPrecautions: [''],
    requiredMaterials: [{ name: '', specification: '', quantity: '' }]
  };
  const [expForm, setExpForm] = useState(initialExpForm);

  const token = localStorage.getItem('jwt_token');

  // --- DATA FETCHERS ---
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/submissions/teacher/all', { headers: { Authorization: `Bearer ${token}` } });
      setSubmissions(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    } catch (err) { setError('Failed to load submissions.'); } finally { setLoading(false); }
  };

  const fetchPendingTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/teacher/pending-teachers', { headers: { Authorization: `Bearer ${token}` } });
      setPendingTeachers(data);
    } catch (err) { setError("Failed to load pending teachers."); } finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/teacher/students', { headers: { Authorization: `Bearer ${token}` } });
      setStudents(data);
    } catch (err) { setError('Failed to load students.'); } finally { setLoading(false); }
  };
  
  const fetchExperiments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/teacher/experiments', { headers: { Authorization: `Bearer ${token}` } });
      setExperiments(data);
    } catch (err) { setError('Failed to load experiments.'); } finally { setLoading(false); }
  };

  const fetchQuizScores = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8080/api/teacher/quiz-results', { headers: { Authorization: `Bearer ${token}` } });
      setQuizScores(data);
    } catch (err) { setError('Failed to load scores.'); } finally { setLoading(false); }
  };

  useEffect(() => {
    setError('');
    if (activeTab === 'submissions') fetchSubmissions();
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'experiments') fetchExperiments();
    if (activeTab === 'scores') fetchQuizScores();
    if (activeTab === 'approvals') fetchPendingTeachers();
  }, [activeTab]);

  // --- ACTIONS ---
  const handleApproveTeacher = async (id, name) => {
    if (window.confirm(`Approve ${name} as a verified teacher?`)) {
      try {
        await axios.put(`http://localhost:8080/api/teacher/approve-teacher/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        alert(`${name} has been approved and can now log in!`);
        fetchPendingTeachers(); // Refresh the list
      } catch (err) { alert("Failed to approve teacher."); }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/submissions/teacher/export', { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', 'EE_Lab_Submissions.xlsx');
      document.body.appendChild(link); link.click(); link.parentNode.removeChild(link);
    } catch (err) { alert("Failed to export Excel."); }
  };

  const handleRemoveStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/teacher/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setStudents(students.filter(s => s.userId !== id));
      } catch (err) { alert("Failed to remove student."); }
    }
  };

  const handleGenerateQuiz = async () => {
  try {
    const { data } = await axios.post(`http://localhost:8080/api/teacher/generate-quiz/${aiSemesterId}?count=${aiQuestionCount}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setGeneratedQuiz(data);
  } catch (err) { 
    alert(err.response?.data?.error || "Failed to generate quiz."); 
  }
};

  //quiz
  const openPublishModal = (targetSem) => {
    setScheduleData({ ...scheduleData, targetSemester: targetSem });
    setIsPublishModalOpen(true);
  };

  const executePublish = async () => {
    // Combine Date and Time into a Java-friendly ISO format
    const startDateTime = `${scheduleData.date}T${scheduleData.time}:00`;
    
    // Transform manual questions so they match the AI's exact format
    const formattedManualQuestions = manualQuiz.questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.options[q.correctIndex] // Converts the radio button index back into the actual text string
    }));

    const payload = {
      title: generatedQuiz?.title || manualQuiz.title,
      semester: scheduleData.targetSemester,
      startTime: startDateTime,
      durationMinutes: scheduleData.duration,
      // Pass the correctly formatted questions based on which mode the teacher used
      questions: JSON.stringify(generatedQuiz?.questions || formattedManualQuestions)
    };

    try {
      await axios.post('http://localhost:8080/api/teacher/publish-quiz', payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Quiz scheduled and published successfully!");
      setIsPublishModalOpen(false);
      setQuizMode('select');
      setGeneratedQuiz(null);
      // Optional: Reset manual quiz state after publishing
      setManualQuiz({ semesterId: '1', title: '', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0 }] });
    } catch (err) { 
      alert("Failed to publish quiz."); 
    }
  };

  const addManualQuestion = () => setManualQuiz({ ...manualQuiz, questions: [...manualQuiz.questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }] });
  const updateQuestionText = (qIndex, text) => { const updatedQs = [...manualQuiz.questions]; updatedQs[qIndex].question = text; setManualQuiz({ ...manualQuiz, questions: updatedQs }); };
  const updateOptionText = (qIndex, optIndex, text) => { const updatedQs = [...manualQuiz.questions]; updatedQs[qIndex].options[optIndex] = text; setManualQuiz({ ...manualQuiz, questions: updatedQs }); };
  const setCorrectOption = (qIndex, optIndex) => { const updatedQs = [...manualQuiz.questions]; updatedQs[qIndex].correctIndex = optIndex; setManualQuiz({ ...manualQuiz, questions: updatedQs }); };

  // --- NEW: DYNAMIC EXPERIMENT ARRAY HANDLERS ---
  const handleArrayTextChange = (field, index, value) => {
    const newArr = [...expForm[field]];
    newArr[index] = value;
    setExpForm({ ...expForm, [field]: newArr });
  };
  const addArrayItem = (field, defaultVal = '') => setExpForm({ ...expForm, [field]: [...expForm[field], defaultVal] });
  const removeArrayItem = (field, index) => setExpForm({ ...expForm, [field]: expForm[field].filter((_, i) => i !== index) });

  const handleMaterialChange = (index, key, value) => {
    const newMats = [...expForm.requiredMaterials];
    newMats[index][key] = value;
    setExpForm({ ...expForm, requiredMaterials: newMats });
  };

  // Safe JSON parser for loading data from DB
  // FIX 1: Robust parser that safely extracts arrays even if Java previously sent them as string blocks
  const safeParse = (data, defaultVal) => {
    if (!data) return defaultVal;
    if (Array.isArray(data)) return data.length > 0 ? data : defaultVal;
    if (typeof data === 'string') {
      try { 
        const parsed = JSON.parse(data); 
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultVal;
      } catch { return defaultVal; }
    }
    return defaultVal;
  };

  const openAddModal = () => {
    setEditingExpId(null);
    setExpForm(initialExpForm);
    setIsExpModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpId(exp.id);
    setExpForm({
      title: exp.title || '', semester: exp.semester || 1, difficulty: exp.difficulty || 'Basic',
      duration: exp.duration || '2 hours', teamSize: exp.teamSize || 4,
      summary: exp.summary || '', description: exp.description || '', 
      simulatorUrl: exp.simulatorUrl || '', imageUrl: exp.imageUrl || '',
      learningObjectives: safeParse(exp.learningObjectives, ['']),
      observationColumns: safeParse(exp.observationColumns, ['S. No.']),
      procedureSteps: safeParse(exp.procedureSteps|| exp.procedure, ['']),
      safetyPrecautions: safeParse(exp.safetyPrecautions, ['']),
      requiredMaterials: safeParse(exp.requiredMaterials, [{ name: '', specification: '', quantity: '' }])
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExperiment = async (e) => {
    e.preventDefault();
    // Stringify arrays so Java can safely store them as Text/JSON
    // FIX 3: Do NOT use JSON.stringify here! Send the pure React array to Spring Boot.
    // Jackson and @JdbcTypeCode handle the array-to-JSON conversion natively in the backend.
    const payload = { 
        ...expForm,
        // Java expects "procedure", so we assign our procedureSteps array to it
        procedure: expForm.procedureSteps 
    };
    // Delete the React-only key so we don't send confusing extra data to Spring Boot
    delete payload.procedureSteps;

    try {
      if (editingExpId) {
        await axios.put(`http://localhost:8080/api/teacher/experiments/${editingExpId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        alert("Experiment updated!");
      } else {
        await axios.post('http://localhost:8080/api/teacher/experiments', payload, { headers: { Authorization: `Bearer ${token}` } });
        alert("Experiment created!");
      }
      setIsExpModalOpen(false);
      fetchExperiments();
    } catch (err) { 
      console.error("Save Error:", err);
      alert("Failed to save experiment."); 
    }
  };

  const handleDeleteExperiment = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:8080/api/teacher/experiments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchExperiments();
      } catch (err) { alert("Failed to delete experiment."); }
    }
  };


  // --- VIEW FILTERS ---
  const filteredSubmissions = submissions.filter(sub => (!semesterFilter || sub.semester.toString() === semesterFilter) && (!dateFilter || new Date(new Date(sub.submittedAt) - (new Date(sub.submittedAt).getTimezoneOffset() * 60000)).toISOString().split('T')[0] === dateFilter));
  const filteredStudents = students.filter(student => !studentSemesterFilter || student.semester.toString() === studentSemesterFilter);
  const filteredScores = quizScores.filter(score => (!scoresSemesterFilter || score.semester.toString() === scoresSemesterFilter) && (!scoresDateFilter || score.date === scoresDateFilter));

  return (
    <div className="teacher-dashboard" style={{ padding: '6rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="section-title">Teacher Command Center</h2>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', marginBottom: '2rem', overflowX: 'auto' }}>
        {/* Dynamically include 'approvals' ONLY if the user is an admin */}
        {[
          'submissions', 'students', 'experiments', 'quizzes', 'scores',
          ...(user?.role === 'admin' ? ['approvals'] : [])
        ].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize', whiteSpace: 'nowrap', color: activeTab === tab ? 'var(--accent-color)' : '#666', borderBottom: activeTab === tab ? '3px solid var(--accent-color)' : '3px solid transparent', transition: 'all 0.2s' }}>
            {tab === 'submissions' && '📊 Submissions'}
            {tab === 'students' && '👥 Students'}
            {tab === 'experiments' && '🧪 Experiments'}
            {tab === 'quizzes' && '📝 Manage Quizzes'}
            {tab === 'scores' && '💯 Quiz Scores'}
            {tab === 'approvals' && '🛡️ Pending Approvals'}
          </button>
        ))}
      </div>

      {error && <div className="auth-error-banner">{error}</div>}

      {/* --- TAB 1: SUBMISSIONS --- */}
      {activeTab === 'submissions' && !loading && (
        <>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Semester</label>
              <select className="table-input" style={{ width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }} value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
                <option value="">All</option>{[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Date</label>
              <input type="date" className="table-input" style={{ width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>
            {(semesterFilter || dateFilter) && (<button onClick={() => {setSemesterFilter(''); setDateFilter('');}} style={{ marginTop: '1.2rem', padding: '0.5rem 1rem', background: 'none', border: '1px dashed #999', borderRadius: '6px', color: '#666', cursor: 'pointer' }}>Clear ✖</button>)}
            <button onClick={handleExportExcel} style={{ marginTop: '1.2rem', marginLeft: 'auto', padding: '0.5rem 1.2rem', backgroundColor: '#1e8e3e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>📥 Export to Excel</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredSubmissions.map((sub) => (
              <div key={sub.submissionId} style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div><h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-color)' }}>{sub.studentName}</h3><p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{sub.studentEmail} | Semester {sub.semester}</p></div>
                  <div style={{ textAlign: 'right' }}><p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Experiment ID: {sub.experimentId}</p><p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{new Date(sub.submittedAt).toLocaleString()}</p></div>
                </div>
                <div className="table-responsive">
                  <table className="lab-table" style={{ marginTop: '1rem' }}>
                    <thead><tr>{sub.observationData.columns.map((col, idx) => <th key={idx}>{col.name} {col.isCalculated ? ' (ƒ)' : ''}</th>)}</tr></thead>
                    <tbody>{sub.observationData.data.map((row, rowIdx) => <tr key={rowIdx}>{sub.observationData.columns.map((col, colIdx) => <td key={colIdx} style={{ color: col.isCalculated ? 'var(--accent-color)' : '#444', fontWeight: col.isCalculated ? 'bold' : 'normal' }}>{row[col.name] !== undefined ? row[col.name] : '-'}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- TAB 2: MANAGE STUDENTS --- */}
      {activeTab === 'students' && !loading && (
        <>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Filter by Semester</label>
              <select className="table-input" style={{ width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }} value={studentSemesterFilter} onChange={(e) => setStudentSemesterFilter(e.target.value)}>
                <option value="">All Semesters</option>{[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num}</option>)}
              </select>
            </div>
            {studentSemesterFilter && <button onClick={() => setStudentSemesterFilter('')} style={{ marginTop: '1.2rem', padding: '0.5rem 1rem', background: 'none', border: '1px dashed #999', borderRadius: '6px', color: '#666', cursor: 'pointer' }}>Clear ✖</button>}
            <div style={{ marginTop: '1.2rem', marginLeft: 'auto', fontSize: '0.9rem', color: '#666' }}>Showing <strong>{filteredStudents.length}</strong> student(s)</div>
          </div>
          <div className="table-responsive">
            <table className="lab-table">
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Semester</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.userId}>
                    <td>{student.userId}</td><td><strong>{student.name}</strong></td><td>{student.email}</td><td>Semester {student.semester}</td><td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td><button onClick={() => handleRemoveStudent(student.userId, student.name)} style={{ background: '#ffeeee', color: '#dc2626', border: '1px solid #f87171', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- TAB 3: EXPERIMENTS (NEW LIST VIEW) --- */}
      {activeTab === 'experiments' && !loading && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0 }}>Laboratory Manuals</h3>
            <button className="hero-button" style={{ margin: 0 }} onClick={openAddModal}>+ Add New Experiment</button>
          </div>
          <div className="table-responsive">
            <table className="lab-table">
              <thead><tr><th>ID</th><th>Sem</th><th>Title</th><th>Difficulty</th><th>Actions</th></tr></thead>
              <tbody>
                {experiments.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.id}</td><td>{exp.semester}</td><td><strong>{exp.title}</strong></td><td>{exp.difficulty || 'Basic'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => openEditModal(exp)} style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #7dd3fc', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDeleteExperiment(exp.id, exp.title)} style={{ background: '#ffeeee', color: '#dc2626', border: '1px solid #f87171', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- BIG MODAL FOR CREATING/EDITING EXPERIMENTS --- */}
      {isExpModalOpen && (
        <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '2rem', overflowY: 'auto' }} onClick={() => setIsExpModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%', padding: '2rem', marginBottom: '2rem' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--accent-color)' }}>{editingExpId ? 'Edit Experiment' : 'Create New Experiment'}</h2>
              <button className="modal-close" style={{ position: 'static' }} onClick={() => setIsExpModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveExperiment}>
              
              {/* SECTION 1: Core Details */}
              <h4 style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', borderLeft: '4px solid var(--accent-color)' }}>1. Core Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Title</label>
                  <input type="text" className="table-input" required value={expForm.title} onChange={e => setExpForm({...expForm, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Semester</label>
                  <input type="number" className="table-input" min="1" max="8" required value={expForm.semester} onChange={e => setExpForm({...expForm, semester: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Difficulty</label>
                  <input type="text" className="table-input" value={expForm.difficulty} onChange={e => setExpForm({...expForm, difficulty: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Duration</label>
                  <input type="text" className="table-input" value={expForm.duration} onChange={e => setExpForm({...expForm, duration: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Image URL</label>
                  <input type="url" className="table-input" value={expForm.imageUrl} onChange={e => setExpForm({...expForm, imageUrl: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Simulator URL (Falstad)</label>
                  <input type="url" className="table-input" value={expForm.simulatorUrl} onChange={e => setExpForm({...expForm, simulatorUrl: e.target.value})} />
                </div>
              </div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Short Summary</label>
              <textarea className="table-input" style={{ minHeight: '60px', marginBottom: '1rem' }} value={expForm.summary} onChange={e => setExpForm({...expForm, summary: e.target.value})} />
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem' }}>Full Description</label>
              <textarea className="table-input" style={{ minHeight: '100px', marginBottom: '2rem' }} value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} />

              {/* SECTION 2: Dynamic Lists */}
              <h4 style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', borderLeft: '4px solid var(--accent-color)' }}>2. Content & Procedures</h4>
              
              {/* Learning Objectives */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Learning Objectives</label>
                {expForm.learningObjectives.map((obj, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" className="table-input" placeholder={`Objective ${idx + 1}`} value={obj} onChange={e => handleArrayTextChange('learningObjectives', idx, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('learningObjectives', idx)} style={{ background: '#ffeeee', color: '#dc2626', border: '1px solid #f87171', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('learningObjectives')} style={{ fontSize: '0.85rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add Objective</button>
              </div>

              {/* Procedure Steps */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Procedure Steps</label>
                {expForm.procedureSteps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ padding: '10px 0', fontWeight: 'bold', color: '#666' }}>{idx + 1}.</span>
                    <input type="text" className="table-input" placeholder="Instruction step..." value={step} onChange={e => handleArrayTextChange('procedureSteps', idx, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('procedureSteps', idx)} style={{ background: '#ffeeee', color: '#dc2626', border: '1px solid #f87171', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('procedureSteps')} style={{ fontSize: '0.85rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add Step</button>
              </div>

              {/* Safety Precautions */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Safety Precautions</label>
                {expForm.safetyPrecautions.map((safe, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input type="text" className="table-input" placeholder="e.g., Do not touch live wires" value={safe} onChange={e => handleArrayTextChange('safetyPrecautions', idx, e.target.value)} />
                    <button type="button" onClick={() => removeArrayItem('safetyPrecautions', idx)} style={{ background: '#ffeeee', color: '#dc2626', border: '1px solid #f87171', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('safetyPrecautions')} style={{ fontSize: '0.85rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Add Precaution</button>
              </div>

              {/* SECTION 3: Required Materials (Table Format) */}
              <h4 style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', borderLeft: '4px solid var(--accent-color)' }}>3. Required Materials</h4>
              <div className="table-responsive" style={{ marginBottom: '2rem', border: '1px solid #ddd' }}>
                <table className="lab-table" style={{ margin: 0 }}>
                  <thead><tr><th>Equipment Name</th><th>Specification</th><th>Quantity</th><th></th></tr></thead>
                  <tbody>
                    {expForm.requiredMaterials.map((mat, idx) => (
                      <tr key={idx}>
                        <td><input type="text" className="table-input" placeholder="e.g., DC Voltmeter" value={mat.name} onChange={e => handleMaterialChange(idx, 'name', e.target.value)} /></td>
                        <td><input type="text" className="table-input" placeholder="e.g., 0-250V" value={mat.specification} onChange={e => handleMaterialChange(idx, 'specification', e.target.value)} /></td>
                        <td><input type="text" className="table-input" placeholder="e.g., 2" value={mat.quantity} onChange={e => handleMaterialChange(idx, 'quantity', e.target.value)} /></td>
                        <td><button type="button" onClick={() => removeArrayItem('requiredMaterials', idx)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => addArrayItem('requiredMaterials', {name:'', specification:'', quantity:''})} style={{ fontSize: '0.85rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '2rem' }}>+ Add Material</button>

              <div style={{ display: 'flex', gap: '15px', borderTop: '2px solid #eee', paddingTop: '1.5rem' }}>
                <button type="button" className="hero-button" onClick={() => setIsExpModalOpen(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>Cancel</button>
                <button type="submit" className="hero-button" style={{ flex: 2 }}>{editingExpId ? 'Save Changes' : 'Create Experiment'}</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- TAB 4: QUIZZES --- */}
      {activeTab === 'quizzes' && !loading && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '2rem', minHeight: '400px' }}>
          
          {quizMode === 'select' && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '2rem' }}>Create an Assessment</h3>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div onClick={() => setQuizMode('manual')} style={{ flex: 1, maxWidth: '300px', padding: '2rem', border: '2px solid #e0e0e0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} className="card">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', margin: '0 0 0.5rem 0' }}>Manual Builder</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Write your own questions, define options, and set specific answer keys.</p>
                </div>
                <div onClick={() => setQuizMode('ai')} style={{ flex: 1, maxWidth: '300px', padding: '2rem', border: '2px solid #e0e0e0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} className="card">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', margin: '0 0 0.5rem 0' }}>AI Generator</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>Let Gemini read the experiment data and auto-generate a quiz instantly.</p>
                </div>
              </div>
            </div>
          )}

          {quizMode === 'ai' && (
            <div>
              <button onClick={() => {setQuizMode('select'); setGeneratedQuiz(null);}} className="back-button" style={{ marginBottom: '1rem' }}>← Back to Options</button>
              <h3 style={{ marginTop: 0 }}>Generate AI Quiz</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '2rem' }}>
  <select 
    className="table-input" 
    style={{ width: '300px', border: '1px solid #ccc' }} 
    value={aiSemesterId} 
    onChange={(e) => setAiSemesterId(parseInt(e.target.value))}
  >
    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num} Topics</option>)}
  </select>
  
  <select 
    className="table-input" 
    style={{ width: '150px', border: '1px solid #ccc' }} 
    value={aiQuestionCount} 
    onChange={(e) => setAiQuestionCount(parseInt(e.target.value))}
  >
    <option value={5}>5 Questions</option>
    <option value={10}>10 Questions</option>
    <option value={15}>15 Questions</option>
    <option value={20}>20 Questions</option>
  </select>
  
  <button 
    className="hero-button" 
    onClick={handleGenerateQuiz} 
    style={{ margin: 0, padding: '8px 20px' }}
  >
    Generate
  </button>
</div>

              {generatedQuiz && (
                <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <h4 style={{ color: 'var(--accent-color)', marginTop: 0 }}>{generatedQuiz.title || 'AI Assessment'}</h4>
                  {generatedQuiz.questions && Array.isArray(generatedQuiz.questions) ? (
                    <>
                      {generatedQuiz.questions.map((q, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem' }}>
                          <p style={{ fontWeight: '600', margin: '0 0 0.5rem 0' }}>{i + 1}. {q.question}</p>
                          <ul style={{ listStyleType: 'circle', paddingLeft: '20px', margin: '0 0 0.5rem 0', color: '#555' }}>
                            {q.options?.map((opt, oIdx) => <li key={oIdx}>{opt}</li>)}
                          </ul>
                          <p style={{ fontSize: '0.85rem', color: '#1e8e3e', margin: 0 }}><strong>Answer:</strong> {q.answer}</p>
                        </div>
                      ))}
                      <button onClick={() => openPublishModal(aiSemesterId)} className="hero-button" style={{ width: '100%', marginTop: '1rem' }}>Publish to Students</button>                    </>
                  ) : (
                    <div style={{ background: '#ffeeee', color: '#cc0000', padding: '1rem', borderRadius: '8px' }}>
                      <strong>AI formatting error.</strong><pre style={{ textAlign: 'left', fontSize: '12px', whiteSpace: 'pre-wrap', color: '#333' }}>{JSON.stringify(generatedQuiz, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {quizMode === 'manual' && (
            <div>
              <button onClick={() => setQuizMode('select')} className="back-button" style={{ marginBottom: '1rem' }}>← Back to Options</button>
              <h3 style={{ marginTop: 0 }}>Manual Quiz Builder</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>Quiz Title</label>
                  <input type="text" className="table-input" style={{ border: '1px solid #ccc' }} placeholder="e.g., Mid-Term Viva" value={manualQuiz.title} onChange={e => setManualQuiz({...manualQuiz, title: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>Link to Semester</label>
                  <select className="table-input" style={{ border: '1px solid #ccc' }} value={manualQuiz.semesterId} onChange={e => setManualQuiz({...manualQuiz, semesterId: e.target.value})}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num}</option>)}
                  </select>
                </div>
              </div>

              {manualQuiz.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Question {qIndex + 1}</label>
                  <input type="text" className="table-input" style={{ border: '1px solid #ccc', marginBottom: '1rem' }} placeholder="Enter question..." value={q.question} onChange={e => updateQuestionText(qIndex, e.target.value)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="radio" name={`correct-${qIndex}`} checked={q.correctIndex === optIndex} onChange={() => setCorrectOption(qIndex, optIndex)} title="Mark as correct" />
                        <input type="text" className="table-input" style={{ border: '1px solid #eee' }} placeholder={`Option ${optIndex + 1}`} value={opt} onChange={e => updateOptionText(qIndex, optIndex, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={addManualQuestion} style={{ flex: 1, padding: '10px', background: 'none', border: '2px dashed #ccc', borderRadius: '8px', color: '#666', fontWeight: '600', cursor: 'pointer' }}>+ Add Another</button>
                  <button type="button" onClick={() => openPublishModal(manualQuiz.semesterId)} className="hero-button" style={{ flex: 1, margin: 0 }}>
                    Save & Publish
                  </button> 
                 </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 5: QUIZ SCORES (NEW) --- */}
      {activeTab === 'scores' && !loading && (
        <>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Filter by Semester</label>
              <select className="table-input" style={{ width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }} value={scoresSemesterFilter} onChange={(e) => setScoresSemesterFilter(e.target.value)}>
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Semester {num}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: '#555' }}>Filter by Date</label>
              <input type="date" className="table-input" style={{ width: '150px', backgroundColor: 'white', border: '1px solid #ccc' }} value={scoresDateFilter} onChange={(e) => setScoresDateFilter(e.target.value)} />
            </div>
            {(scoresSemesterFilter || scoresDateFilter) && (
              <button onClick={() => {setScoresSemesterFilter(''); setScoresDateFilter('');}} style={{ marginTop: '1.2rem', padding: '0.5rem 1rem', background: 'none', border: '1px dashed #999', borderRadius: '6px', color: '#666', cursor: 'pointer' }}>Clear ✖</button>
            )}
            <div style={{ marginTop: '1.2rem', marginLeft: 'auto', fontSize: '0.9rem', color: '#666' }}>Showing <strong>{filteredScores.length}</strong> record(s)</div>
          </div>

          <div className="table-responsive">
            <table className="lab-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Semester</th>
                  <th>Quiz Title</th>
                  <th>Score</th>
                  <th>Date Taken</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No quiz scores found.</td></tr>
                ) : (
                  filteredScores.map(score => (
                    <tr key={score.id}>
                      <td><strong>{score.studentName}</strong></td>
                      <td>Semester {score.semester}</td>
                      <td>{score.quizTitle}</td>
                      <td>
                        {/* Display score out of total. Turn it green if perfect, red if poor */}
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: (score.score / score.total) >= 0.8 ? '#16a34a' : (score.score / score.total) < 0.5 ? '#dc2626' : '#ea580c' 
                        }}>
                          {score.score} / {score.total}
                        </span>
                      </td>
                      <td>{score.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- PUBLISH SCHEDULING MODAL --- */}
      {isPublishModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPublishModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Schedule Quiz</h3>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>Set strict timing rules. Students will be locked out before the start time and after the duration expires.</p>
            
            <label style={{ display: 'block', fontWeight: '600', marginTop: '1rem' }}>Target Semester</label>
            <input type="number" className="table-input" value={scheduleData.targetSemester} disabled style={{ background: '#eee' }} />

            <label style={{ display: 'block', fontWeight: '600', marginTop: '1rem' }}>Start Date</label>
            <input type="date" className="table-input" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} required />

            <label style={{ display: 'block', fontWeight: '600', marginTop: '1rem' }}>Start Time</label>
            <input type="time" className="table-input" value={scheduleData.time} onChange={e => setScheduleData({...scheduleData, time: e.target.value})} required />

            <label style={{ display: 'block', fontWeight: '600', marginTop: '1rem' }}>Duration (Minutes)</label>
            <input type="number" className="table-input" value={scheduleData.duration} onChange={e => setScheduleData({...scheduleData, duration: e.target.value})} required />

            <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
              <button className="hero-button" onClick={() => setIsPublishModalOpen(false)} style={{ flex: 1, background: '#eee', color: '#333' }}>Cancel</button>
              <button className="hero-button" onClick={executePublish} style={{ flex: 1 }}>Confirm Publish</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 6: ADMIN APPROVALS (ADMIN ONLY) --- */}
      {activeTab === 'approvals' && user?.role === 'admin' && !loading && (
        <div className="table-responsive">
          <table className="lab-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Registration Date</th><th>Action</th></tr></thead>
            <tbody>
              {pendingTeachers.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No pending teacher requests.</td></tr>
              ) : (
                pendingTeachers.map(teacher => (
                  <tr key={teacher.userId}>
                    <td>{teacher.userId}</td>
                    <td><strong>{teacher.name}</strong></td>
                    <td>{teacher.email}</td>
                    <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleApproveTeacher(teacher.userId, teacher.name)} 
                        style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Approve Access
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import labEquipmentImage from '../assets/lab-equipment.jpg';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Footer from './Footer';
import SimulatorEmbed from './SimulatorEmbed'; 
import ObservationTable from './ObservationTable';

// --- SVG Icons ---
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

// --- SemestersView Component ---
const SemestersView = ({ onSelectSemester }) => {
    const semesters = [
        { id: 2, title: 'EE 102 BEE', description: 'EE 102 BASIC ELECTRICAL ENGINEERING LABORATORY.', experimentCount: 10 },
        { id: 3, title: 'Semester 3', description: 'Exploring semiconductor devices and digital logic.', experimentCount: 10 },
        { id: 4, title: 'Semester 4', description: 'Analog circuits and communication principles.', experimentCount: 10 },
        { id: 5, title: 'Semester 5', description: 'Microprocessors and control systems.', experimentCount: 10 },
        { id: 6, title: 'Semester 6', description: 'Power electronics and electrical machines.', experimentCount: 10 },
        { id: 7, title: 'Semester 7', description: 'Advanced topics and project-based labs.', experimentCount: 10 },
    ];

    return (
        <div id="semesters">
            <div className="section-header">
                <h2 className="section-title">Choose Your Semester</h2>
                <p className="section-description">
                    Access comprehensive electrical engineering experiments organized by semester.
                </p>
            </div>
            <div className="card-grid">
                {semesters.map(semester => (
                    <div key={semester.id} className="card" onClick={() => onSelectSemester(semester.id)}>
                        <div className="card-icon"><FolderIcon /></div>
                        <h3 className="card-title">{semester.title}</h3>
                        <p className="card-description">{semester.description}</p>
                        <div className="card-footer">
                            <span>{semester.experimentCount} Experiments</span>
                            <span className="card-arrow"><ArrowRightIcon /></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ExperimentsView Component ---
const ExperimentsView = ({ semesterId, onSelectExperiment, onBack }) => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:8080/api/experiments/semester/${semesterId}`);
                setExperiments(data);
            } catch (error) {
                console.error("Error fetching experiments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiments();
    }, [semesterId]);

    if (loading) return <div>Loading experiments...</div>;

    return (
        <div>
            <button onClick={onBack} className="back-button" style={{ marginBottom: '2rem' }}>
                &larr; Back to Semesters
            </button>
            <div className="section-header">
                <h2 className="section-title">Semester {semesterId} Experiments</h2>
                <p className="section-description">
                    Complete your electrical engineering practical work with these comprehensive experiments.
                </p>
            </div>
            <div className="card-grid">
                {experiments.map(exp => (
                    <div key={exp.id} className="card" onClick={() => onSelectExperiment(exp.id)}>
                        <div className={`difficulty-tag ${exp.difficulty}`}>{exp.difficulty}</div>
                        <div className="card-icon"><PlayIcon /></div>
                        <h3 className="card-title">{exp.title}</h3>
                        <p className="card-description">{exp.description}</p>
                        <div className="card-footer">
                            <span>&#128337; {exp.duration}</span>
                            <span>&#128101; {exp.teamSize} people</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- ExperimentDetailView Component (MODIFIED) ---
// --- ExperimentDetailView Component (MODIFIED) ---
const ExperimentDetailView = ({ experimentId, onBack }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State for the observation table (start with 5 empty rows)
    const [obsRows, setObsRows] = useState(5);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:8080/api/experiments/${experimentId}`);
                setDetails(data);
            } catch (error) {
                console.error("Error fetching experiment details:", error);
                setDetails(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [experimentId]);

    if (loading) return <div>Loading experiment details...</div>;
    
    if (!details) {
        return (
             <div className="experiment-detail-container">
                <button onClick={onBack} className="back-button">&larr; Back to Semester</button>
                <h1 className="section-title">Experiment Details Not Found</h1>
            </div>
        );
    }

    // --- BULLETPROOF ARRAY PARSER ---
    // Forces any stringified JSON back into a real React Array
    const safeParse = (data, defaultVal) => {
        if (!data) return defaultVal;
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') {
            try { return JSON.parse(data); } 
            catch { return defaultVal; }
        }
        return defaultVal;
    };

    // Safely extract all arrays before rendering to prevent crashes
    const parsedObjectives = safeParse(details.learningObjectives, []);
    const parsedProcedure = safeParse(details.procedureSteps || details.procedure, []);
    const parsedColumns = safeParse(details.observationColumns || details.ObservationColumns, []);
    const parsedMaterials = safeParse(details.requiredMaterials, []);
    const parsedSafety = safeParse(details.safetyPrecautions, []);

    const simUrl = details.simulatorUrl ? details.simulatorUrl : "https://www.falstad.com/circuit/circuitjs.html";
    const simDescription = details.simulatorUrl
      ? "This experiment has a pre-built circuit. Interact with it below!"
      : "Build, test, and simulate the circuit right here in your browser before you perform the lab.";

    return (
        <div className="experiment-detail-container">
            <button onClick={onBack} className="back-button">&larr; Back to Semester</button>
            <div className="experiment-header">
                <h1 className="section-title">{details.title}</h1>
                <div className="experiment-header-info">
                    <span>&#128337; {details.duration}</span>
                    <span>&#128101; {details.teamSize} people</span>
                    <span className={`difficulty-tag ${details.difficulty}`}>{details.difficulty}</span>
                </div>
            </div>

            <div className="experiment-main-content">
                {/* --- Left Column --- */}
                <div className="experiment-left-column">
                    <p className="experiment-summary">{details.summary}</p>
                    <img 
                        src={details.imageUrl ? details.imageUrl : labEquipmentImage} 
                        alt={details.title} 
                        className="experiment-image" 
                        style={{ objectFit: 'cover', height: '400px', width: '100%' }} 
                    />
                    
                    <div className="detail-section">
                        <h3>Learning Objectives</h3>
                        <ul className="detail-list">
                            {parsedObjectives.map((obj, i) => <li key={i}>✔️ {obj}</li>)}
                        </ul>
                    </div>
                    
                    <div className="detail-section">
                        <h3>Procedure</h3>
                        <ul className="detail-list procedure-list">
                            {parsedProcedure.map((step, i) => (
                                <li key={i} className="procedure-step">
                                    <span className="procedure-number">{i + 1}</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- THE INTERACTIVE OBSERVATION TABLE --- */}
                    <div className="detail-section" style={{ marginTop: '3rem' }}>
                        <h3>Laboratory Observations</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Record your readings below. Ensure all connections are secure before powering the circuit.
                        </p>
                        <ObservationTable 
                            initialColumns={parsedColumns} 
                            experimentId={details.id} 
                        />
                    </div>

                    <div className="detail-section">
                        <h3>Interactive Simulator</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                           {simDescription}
                        </p>
                        <SimulatorEmbed src={simUrl} /> 
                    </div>
                </div>

                {/* --- Right Column (Sidebar) --- */}
                <div className="experiment-right-column">
                  <div className="sidebar-sticky-wrapper">
                    
                    {/* Materials Table */}
                    <div className="sidebar-card">
                        <h3>Required Materials</h3>
                        {parsedMaterials.length > 0 ? (
                            <table className="lab-table materials-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Spec</th>
                                        <th>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedMaterials.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.specification}</td>
                                            <td style={{textAlign: 'center'}}>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{color: '#666', fontSize: '0.9rem'}}>No materials listed.</p>
                        )}
                    </div>

                    <div className="sidebar-card" style={{ marginTop: '1.5rem' }}>
                        <h3>Safety Precautions</h3>
                        <ul className="detail-list">
                            {parsedSafety.map((item, i) => <li key={i}>⚠️ {item}</li>)}
                        </ul>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Controller Component ---
const MainContent = ({ view, semesterId, experimentId, onSelectSemester, onSelectExperiment, onBackToSemesters, onBackToExperiments }) => {
    const nodeRef = useRef(null);
    let currentView;

    switch (view) {
        case 'experiments':
            currentView = <ExperimentsView semesterId={semesterId} onSelectExperiment={onSelectExperiment} onBack={onBackToSemesters} />;
            break;
        case 'detail':
            currentView = <ExperimentDetailView experimentId={experimentId} onBack={onBackToExperiments} />;
            break;
        default:
            currentView = <SemestersView onSelectSemester={onSelectSemester} />;
    }

    return (
        <main className="main-content">
            <SwitchTransition>
                <CSSTransition
                    key={view}
                    nodeRef={nodeRef}
                    timeout={500}
                    classNames="content"
                >
                    <div ref={nodeRef}>{currentView}</div>
                </CSSTransition>
            </SwitchTransition>

            {view === 'semesters' && <Footer />}
        </main>
    );
};

export default MainContent;
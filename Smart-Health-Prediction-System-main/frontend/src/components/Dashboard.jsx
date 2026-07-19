import React, { useState, useEffect } from 'react';
import {
    Activity, User, Clipboard, Heart, AlertTriangle, CheckCircle,
    ChevronRight, RefreshCw, LogOut, History, Edit3, Save, X
} from 'lucide-react';

export default function Dashboard({ token, user, onSignOut, onProfileUpdate }) {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);

    // Profile edit states
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        age: user.age,
        bmi: user.bmi,
        medicalHistory: user.medicalHistory
    });

    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    // Fetch prediction history
    const fetchHistory = async () => {
        try {
            const response = await fetch('https://api-smart-health-ai.onrender.com/api/predict/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (err) {
            console.error('Failed to load history:', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [token]);

    // Handle profile field change
    const onProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Submit profile edit
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });

        try {
            const response = await fetch('https://api-smart-health-ai.onrender.com/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    age: Number(profileData.age),
                    bmi: Number(profileData.bmi),
                    medicalHistory: profileData.medicalHistory
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            onProfileUpdate(data); // update in App.jsx parent state
            setIsEditing(false);
            setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setStatusMsg({ type: 'danger', text: err.message || 'Failed to update profile' });
        }
    };

    // Submit symptoms for prediction
    const handlePredict = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setLoading(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const response = await fetch('https://api-smart-health-ai.onrender.com/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ symptoms })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Prediction failed');
            }

            setPrediction(data);
            setSymptoms(''); // clear symptoms input
            await fetchHistory(); // reload history
        } catch (err) {
            setStatusMsg({ type: 'danger', text: err.message || 'Prediction processing error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ animation: 'slideUp 0.5s ease-out' }}>

            {/* Header Panel */}
            <div className="glass-panel dashboard-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={28} color="#14b8a6" className="animate-pulse-slow" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #a5f3fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Smart Health AI
                    </h1>
                </div>
                <div className="user-controls">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#14b8a6', fontWeight: '700', paddingLeft: '9px' }}>
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <span className="user-name">{user.name}</span>
                    </div>
                    <button className="signout-btn" onClick={onSignOut} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>

            {statusMsg.text && (
                <div className={`alert alert-${statusMsg.type}`} style={{ marginBottom: '1.5rem' }}>
                    {statusMsg.text}
                </div>
            )}

            {/* Main Grid */}
            <div className="dashboard-grid">

                {/* Left Side: Profile Information */}
                <div className="sidebar-panel">
                    <div className="glass-panel profile-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                                <User size={18} color="#14b8a6" /> Patient Profile
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{ background: 'none', border: 'none', color: '#14b8a6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}
                                >
                                    <Edit3 size={14} /> Edit
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setIsEditing(false); setProfileData({ age: user.age, bmi: user.bmi, medicalHistory: user.medicalHistory }); }}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}
                                >
                                    <X size={14} /> Cancel
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className="stat-row">
                                    <span className="stat-label">Email</span>
                                    <span className="stat-value" style={{ fontSize: '0.9rem' }}>{user.email}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Age</span>
                                    <span className="stat-value">{user.age} yrs</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">BMI</span>
                                    <span className="stat-value">{user.bmi}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Medical History</span>
                                    <span className="stat-value" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.medicalHistory}>
                                        {user.medicalHistory}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleProfileSubmit}>
                                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                                    <label className="form-label">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={profileData.age}
                                        onChange={onProfileChange}
                                        className="form-input"
                                        min="1"
                                        max="120"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                                    <label className="form-label">BMI</label>
                                    <input
                                        type="number"
                                        name="bmi"
                                        value={profileData.bmi}
                                        onChange={onProfileChange}
                                        className="form-input"
                                        step="0.1"
                                        min="5"
                                        max="60"
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label className="form-label">Medical History</label>
                                    <input
                                        type="text"
                                        name="medicalHistory"
                                        value={profileData.medicalHistory}
                                        onChange={onProfileChange}
                                        className="form-input"
                                        placeholder="None"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.50rem' }}>
                                    <Save size={16} /> Save Changes
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Side: Prediction interface & History */}
                <div className="main-content">

                    {/* Prediction input form */}
                    <div className="glass-panel prediction-panel">
                        <h2 className="panel-title">
                            <Clipboard size={20} color="#14b8a6" /> Analyze Symptoms
                        </h2>
                        <form onSubmit={handlePredict}>
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label className="form-label" style={{ color: 'var(--text-muted)' }}>
                                    Enter your current symptoms (e.g. fever, cough, chest pain, shortness of breath)
                                </label>
                                <input
                                    type="text"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    className="form-input"
                                    placeholder="fever, cough..."
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
                                {loading ? (
                                    <>
                                        <RefreshCw className="spinner animate-pulse-slow" size={16} style={{ marginRight: '8px' }} /> Predicting...
                                    </>
                                ) : (
                                    <>
                                        Run Assessment <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Prediction Display Result */}
                        {prediction && (
                            <div className={`result-card ${prediction.riskLevel.toLowerCase()}`}>
                                <div>
                                    <div className="result-heading">Predicted Condition</div>
                                    <div className="result-value" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {prediction.predictedDisease}
                                        <span className={`badge ${prediction.riskLevel.toLowerCase()}`}>
                                            {prediction.riskLevel} Risk
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.75rem', color: prediction.riskLevel === 'High' ? '#fca5a5' : prediction.riskLevel === 'Medium' ? '#fde047' : '#a7f3d0' }}>
                                        {prediction.riskLevel === 'High' ? (
                                            <AlertTriangle size={16} />
                                        ) : (
                                            <CheckCircle size={16} />
                                        )}
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                            {prediction.riskLevel === 'High' ? 'Requires urgent consultation!' : prediction.riskLevel === 'Medium' ? 'Monitor symptoms closely.' : 'Standard self-care and rest.'}
                                        </span>
                                    </div>
                                </div>

                                <div className="doc-info" style={{ borderLeftColor: prediction.riskLevel === 'High' ? 'var(--risk-high)' : prediction.riskLevel === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)' }}>
                                    <div className="result-heading" style={{ color: 'var(--text-active)' }}>Doctor Recommendation</div>
                                    <p style={{ marginTop: '0.50rem', fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                                        {prediction.recommendedDoctor}
                                    </p>
                                    <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        Please consult the suggested physician for clinical validation.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* History of predictions */}
                    <div className="glass-panel history-card">
                        <h2 className="panel-title">
                            <History size={20} color="#14b8a6" /> Assessment History
                        </h2>

                        {history.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No prior health assessments found. Enter symptoms above to get started.
                            </div>
                        ) : (
                            <div className="history-table-wrapper">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Symptoms</th>
                                            <th>Predicted Disease</th>
                                            <th>Risk Level</th>
                                            <th>Recommended Doctor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record) => (
                                            <tr key={record._id} style={{ animation: 'slideUp 0.3s ease-out' }}>
                                                <td style={{ fontSize: '0.875rem' }}>
                                                    {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td style={{ fontSize: '0.9rem', color: '#fff' }}>{record.symptoms}</td>
                                                <td style={{ fontWeight: '600' }}>{record.predictedDisease}</td>
                                                <td>
                                                    <span className={`badge ${record.riskLevel.toLowerCase()}`}>
                                                        {record.riskLevel}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.9rem' }}>{record.recommendedDoctor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

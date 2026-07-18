import React, { useState } from 'react';
import { Activity, Mail, Lock, User, PlusCircle, LogIn, Heart } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        bmi: '',
        medicalHistory: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, age, bmi, medicalHistory } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const apiURL = 'http://localhost:5000/api/auth';
        const endpoint = isLogin ? `${apiURL}/login` : `${apiURL}/signup`;

        const payload = isLogin
            ? { email, password }
            : {
                name,
                email,
                password,
                age: Number(age),
                bmi: Number(bmi),
                medicalHistory: medicalHistory || 'None'
            };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            onLoginSuccess(data.token, data.user);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Activity className="animate-pulse-slow" size={44} color="#14b8a6" />
                    </div>
                    <h1>Smart Health AI</h1>
                    <p>{isLogin ? 'Sign in to access your predictions' : 'Create an account to predict health risks'}</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={onSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="#64748b" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    className="form-input"
                                    style={{ paddingLeft: '35px' }}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="form-input"
                                style={{ paddingLeft: '35px' }}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="form-input"
                                style={{ paddingLeft: '35px' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={age}
                                        onChange={onChange}
                                        className="form-input"
                                        placeholder="25"
                                        min="1"
                                        max="120"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">BMI</label>
                                    <input
                                        type="number"
                                        name="bmi"
                                        value={bmi}
                                        onChange={onChange}
                                        className="form-input"
                                        placeholder="22.5"
                                        step="0.1"
                                        min="5"
                                        max="60"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Medical History</label>
                                <div style={{ position: 'relative' }}>
                                    <Heart size={18} color="#64748b" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                                    <input
                                        type="text"
                                        name="medicalHistory"
                                        value={medicalHistory}
                                        onChange={onChange}
                                        className="form-input"
                                        style={{ paddingLeft: '35px' }}
                                        placeholder="e.g. Asthma, Diabetes (or 'None')"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? (
                            <span className="spinner">Verifying...</span>
                        ) : isLogin ? (
                            <>
                                <LogIn size={18} style={{ marginRight: '8px' }} /> Sign In
                            </>
                        ) : (
                            <>
                                <PlusCircle size={18} style={{ marginRight: '8px' }} /> Register Account
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? (
                        <>
                            Don't have an account?{' '}
                            <span onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</span>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <span onClick={() => { setIsLogin(true); setError(''); }}>Sign In</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check for existing session
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setToken(storedToken);
            setUser(userData);
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Session verification error:', err);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const handleLoginSuccess = (userToken, userData) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const handleProfileUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', color: '#14b8a6' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid rgba(20, 184, 166, 0.1)', borderTop: '4px solid #14b8a6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontWeight: '500', letterSpacing: '0.05em' }}>Loading Smart Health AI...</p>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div>
      {!token ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard
          token={token}
          user={user}
          onSignOut={handleSignOut}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

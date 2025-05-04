import React from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Welcome to the Home Page</h1>
      {token ? (
        <>
          <p>You are logged in with token:</p>
          <pre style={{ wordBreak: 'break-all' }}>{token}</pre>
          <button onClick={handleLogout} style={{ marginTop: 20 }}>
            Logout
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
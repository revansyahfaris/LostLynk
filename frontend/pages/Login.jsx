import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSSOLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ name: 'Sharon Tabitha', role: 'user' });
    }, 1500);
  };

  const handleNormalLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return alert('Isi dulu username & password-nya!');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (username === 'admin.tekkom' && password === 'undip2026') {
        onLoginSuccess({ name: 'Laboran Tekkom', role: 'admin' });
      } else {
        onLoginSuccess({ name: username, role: 'user' });
      }
    }, 1500);
  };

  return (
    <div className="login-page">
      {/* CSS ANIMATION ENGINE */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0f9ff;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Latar belakang dinamis */
        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(186, 230, 253, 0.2) 100%);
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          animation: float 10s infinite ease-in-out;
        }
        .blob-1 { top: -10%; left: -10%; }
        .blob-2 { bottom: -10%; right: -10%; animation-delay: -5s; }

        .login-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          width: 100%;
          maxWidth: 420px;
          border-radius: 32px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(14, 165, 233, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.5);
          z-index: 10;
          text-align: center;
          animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stagger-1 { animation: fadeIn 0.8s ease forwards; animation-delay: 0.2s; opacity: 0; }
        .stagger-2 { animation: fadeIn 0.8s ease forwards; animation-delay: 0.4s; opacity: 0; }
        .stagger-3 { animation: fadeIn 0.8s ease forwards; animation-delay: 0.6s; opacity: 0; }

        .input-glow:focus {
          outline: none;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1) !important;
          transform: translateY(-1px);
        }

        .sso-button {
          background: #0ea5e9;
          color: white;
          width: 100%;
          padding: 1rem;
          border-radius: 16px;
          border: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px -5px rgba(14, 165, 233, 0.4);
        }

        .sso-button:hover:not(:disabled) {
          background: #0284c7;
          transform: scale(1.02);
          box-shadow: 0 15px 25px -5px rgba(14, 165, 233, 0.5);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      {/* Floating Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        {/* LOGO AREA */}
        <div className="stagger-1">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
            LOST<span style={{ color: '#0ea5e9' }}>LYNK</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
            Logistics Hub Gateway <br /> Teknik Komputer Universitas Diponegoro
          </p>
        </div>

        {/* SSO BUTTON */}
        <div className="stagger-2">
          <button onClick={handleSSOLogin} className="sso-button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : (
              <>
                <img src="https://idp.undip.ac.id/assets/images/logo-undip.png" alt="Undip" style={{ height: '24px' }} />
                Sign in with SSO Undip
              </>
            )}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="stagger-2" style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>OR MANUAL LOGIN</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        {/* MANUAL FORM */}
        <form onSubmit={handleNormalLogin} className="stagger-3" style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Username</label>
            <input
              type="text"
              className="input-glow"
              placeholder="Ex: sharon.tabitha"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#fff', transition: 'all 0.2s' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              className="input-glow"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: '#fff', transition: 'all 0.2s' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '1rem', borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff',
              fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0f172a'}
            onMouseLeave={(e) => e.target.style.background = '#1e293b'}
          >
            {isLoading ? <div className="spinner" style={{ margin: '0 auto' }}></div> : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';

const Login = ({ onLogin }) => {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Lost<span style={{ color: 'var(--accent)' }}>Lynk</span></h2>
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Sistem Informasi Penemuan & Kehilangan Barang Undip</p>
        
        <button className="btn btn-accent" style={{ width: '100%', marginBottom: '1.5rem' }} onClick={onLogin}>
          Masuk dengan SSO Undip
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span>atau Admin</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <div className="form-group">
          <input className="form-input" type="text" placeholder="Username Admin" />
        </div>
        <div className="form-group">
          <input className="form-input" type="password" placeholder="Password" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onLogin}>Masuk Lapak Admin</button>
      </div>
    </div>
  );
};

export default Login;
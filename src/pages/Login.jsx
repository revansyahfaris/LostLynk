import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Handler Login via SSO Undip (Otomatis masuk sebagai User/Mahasiswa)
  const handleSSOLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ name: 'Sharon Tabitha', role: 'user' });
    }, 1200);
  };

  // 2. Handler Form Login Biasa (Deteksi Akun Khusus Admin)
  const handleNormalLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Harap isi username dan password kamu!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      // GERBANG RAHASIA: Cek apakah kredensial yang dimasukkan adalah milik Admin
      if (username === 'admin.tekkom' && password === 'undip2026') {
        onLoginSuccess({ name: 'Laboran Tekkom', role: 'admin' });
      } else {
        // Jika username & password lain, masuk sebagai Mahasiswa/User biasa via jalur reguler
        onLoginSuccess({ name: username, role: 'user' });
      }
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--cream)', padding: '1rem' }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.08)', textAlign: 'center' }}>

        {/* Logo Utama */}
        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          🔗 LOST<span style={{ color: 'var(--black)' }}>LYNK</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Sistem Pelaporan Hub Logistik Barang Hilang Teknik Komputer</p>

        {/* OPSI 1: LOGIN SSO */}
        <button
          onClick={handleSSOLogin}
          disabled={isLoading}
          style={{
            width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: '#fff',
            fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--accent-mid)'}
          onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
        >
          {isLoading ? <span className="spinner"></span> : '🛡️ Masuk via SSO Undip'}
        </button>

        {/* Pembatas Tampilan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0', color: 'var(--border)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '500' }}>ATAU MASUK BIASA</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* OPSI 2: FORM LOGIN BIASA (UMUM) */}
        <form onSubmit={handleNormalLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Username / Email</label>
            <input
              className="form-input"
              type="text"
              placeholder="Masukkan username kamu..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', marginTop: '1.5rem', padding: '0.85rem', borderRadius: '12px', border: 'none',
              background: 'var(--ink)', color: '#fff', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#0f172a'}
            onMouseLeave={(e) => e.target.style.background = 'var(--ink)'}
          >
            {isLoading ? <span className="spinner"></span> : 'Masuk ke Akun'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
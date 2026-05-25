import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// Komponen ikon mata inline — 
const EyeIcon = ({ visible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {visible ? (
      // Mata terbuka
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      // Mata tertutup (coret)
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [nama, setNama] = useState('');

  // State visibility password — terpisah untuk form login & register
  const [showPassword, setShowPassword] = useState(false);

  // Login pakai email + password via Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan password!');
      return;
    }

    setIsLoading(true);
    setError('');

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Email atau password salah!');
      setIsLoading(false);
      return;
    }

    // Ambil data profil user dari tabel users
    const { data: userData } = await supabase
      .from('users')
      .select('nama, role')
      .eq('user_id', data.user.id)
      .single();

    setIsLoading(false);
    onLoginSuccess({
      name: userData?.nama || email,
      role: userData?.role || 'user',
    });
  };

  // Register akun baru
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !nama) {
      setError('Harap isi semua kolom!');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error: registerError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nama },
      },
    });

    if (registerError) {
      setError('Gagal daftar: ' + registerError.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    alert('Pendaftaran berhasil! Silakan login.');
    setIsRegister(false);
    setShowPassword(false);
  };

  // Reset visibility saat ganti mode login/register
  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setShowPassword(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--cream)', padding: '1rem' }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(14, 165, 233, 0.08)', textAlign: 'center' }}>

        {/* Logo */}
        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          🔗 LOST<span style={{ color: 'var(--black)' }}>LYNK</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Sistem Pelaporan Hub Logistik Barang Hilang Teknik Komputer
        </p>

        {/* Tampilkan error */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Form Login atau Register */}
        <form onSubmit={isRegister ? handleRegister : handleLogin} style={{ textAlign: 'left' }}>

          {/* Kolom Nama — hanya muncul saat Register */}
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-input"
                type="text"
                placeholder="Nama lengkap kamu..."
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Password + Ikon Mata */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{ paddingRight: '2.8rem' }}
              />
              {/* Tombol ikon mata */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                tabIndex={-1} // skip saat Tab antar input
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', marginTop: '1.5rem', padding: '0.85rem', borderRadius: '12px', border: 'none',
              background: 'var(--ink)', color: '#fff', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {isLoading ? '⏳ Memproses...' : isRegister ? 'Daftar' : 'Masuk'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <span
            onClick={handleToggleMode}
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isRegister ? 'Masuk' : 'Daftar'}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;

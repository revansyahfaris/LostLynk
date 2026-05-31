import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, LogIn } from 'lucide-react';

const Login = ({ onLoginSuccess, onNavigate }) => {
  const [identifier, setIdentifier] = useState(''); // NIM or Email
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Harap isi NIM/Email dan password!');
      return;
    }

    setIsLoading(true);
    setError('');

    let email = identifier;

    if (/^\d+$/.test(identifier)) {
      const { data: userData, error: nimError } = await supabase
        .from('users')
        .select('email')
        .eq('nim', identifier)
        .single();

      if (nimError || !userData) {
        setError('NIM tidak ditemukan!');
        setIsLoading(false);
        return;
      }
      email = userData.email;
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Kredensial salah atau tidak valid!');
      setIsLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from('users')
      .select('nama, role')
      .eq('user_id', data.user.id)
      .single();

    setIsLoading(false);
    onLoginSuccess({
      name: profileData?.nama || email,
      role: profileData?.role || 'user',
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--cream)', padding: '1.5rem' }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '28px', padding: '3rem', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.08)', textAlign: 'center', border: '1px solid var(--border)' }}>

        {/* Logo Section */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent)', color: '#fff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)' }}>
            <ShieldCheck size={28} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', letterSpacing: '-0.5px' }}>
            LOST<span style={{ color: 'var(--black)' }}>LYNK</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500' }}>
            Sistem Logistik Barang Hilang & Temuan
          </p>
        </div>

        {error && (
          <div style={{ background: '#fff1f2', color: '#e11d48', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #ffe4e6', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: 'var(--ink)' }}>
              <User size={16} color="var(--accent)" /> NIM atau Email
            </label>
            <div style={{ position: 'relative' }}>
                <input
                className="form-input"
                type="text"
                placeholder="Masukkan identitas kamu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
                style={{ padding: '0.8rem 1rem', borderRadius: '14px', fontSize: '1rem' }}
                />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: 'var(--ink)' }}>
              <Lock size={16} color="var(--accent)" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{ padding: '0.8rem 3rem 0.8rem 1rem', borderRadius: '14px', fontSize: '1rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-accent"
            style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.25)' }}
          >
            {isLoading ? (
                <>⏳ Memproses...</>
            ) : (
                <>Masuk ke Sistem <LogIn size={18} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: '500' }}>
            Belum memiliki akun?{' '}
            <span
                onClick={() => onNavigate('daftar')}
                style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}
            >
                Daftar Sekarang
            </span>
            </p>
        </div>

      </div>
    </div>
  );
};

// Simple Info icon replacement since it wasn't imported
const Info = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export default Login;
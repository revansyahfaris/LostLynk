import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Mail, Hash, Lock, Eye, EyeOff, UserPlus, ShieldCheck, Info, ArrowLeft } from 'lucide-react';

const Daftar = ({ onNavigate }) => {
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nama || !nim || !email || !password) {
      setError('Harap isi semua kolom!');
      return;
    }

    if (nim.length < 5) {
      setError('NIM tidak valid!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama, nim },
        },
      });

      if (registerError) throw registerError;

      if (authData.user) {
        const { error: dbError } = await supabase.from('users').insert({
          user_id: authData.user.id,
          nama,
          nim,
          email,
          role: 'user'
        });

        if (dbError) {
          console.error('Gagal menyimpan ke tabel users:', dbError.message);
        }
      }

      alert('Pendaftaran berhasil! Silakan login.');
      onNavigate('login');
    } catch (err) {
      setError('Gagal daftar: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--cream)', padding: '1.5rem' }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '32px', padding: '3rem', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.08)', textAlign: 'center', border: '1px solid var(--border)' }}>

        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--accent)', color: '#fff', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)' }}>
                <UserPlus size={28} />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--black)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Daftar Akun Baru</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: '500' }}>
            Bergabunglah dengan ekosistem LostLynk Undip
            </p>
        </div>

        {error && (
          <div style={{ background: '#fff1f2', color: '#e11d48', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #ffe4e6', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  <User size={14} color="var(--accent)" /> Nama Lengkap
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Sesuai KTM"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  disabled={isLoading}
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  <Hash size={14} color="var(--accent)" /> NIM
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="211201..."
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  disabled={isLoading}
                  style={{ padding: '0.75rem 1rem', borderRadius: '12px' }}
                />
              </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <Mail size={14} color="var(--accent)" /> Email Institusi / Aktif
            </label>
            <input
              className="form-input"
              type="email"
              placeholder="nama@students.undip.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{ padding: '0.75rem 1rem', borderRadius: '12px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <Lock size={14} color="var(--accent)" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{ padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: '12px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex'
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
            style={{ width: '100%', padding: '0.9rem', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.25)' }}
          >
            {isLoading ? '⏳ Mendaftarkan...' : <><UserPlus size={18} /> Buat Akun Sekarang</>}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <button 
                onClick={() => onNavigate('login')}
                style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={16} /> Sudah punya akun? Masuk
            </button>
        </div>
      </div>
    </div>
  );
};

export default Daftar;
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Mail, Hash, ShieldCheck, GraduationCap, Package, Search, ChevronRight } from 'lucide-react';

const Profile = ({ userSession }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ found: 0, lost: 0 });

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const fetchProfileAndStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setProfile(userData);

      const { count: foundCount } = await supabase
        .from('found_item')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: lostCount } = await supabase
        .from('lost_item')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({ found: foundCount || 0, lost: lostCount || 0 });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--accent-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--muted)', fontWeight: '600' }}>Memuat Profil Anda...</p>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '900px' }}>
      <div style={{ background: '#fff', borderRadius: '32px', padding: '3.5rem', border: '1px solid var(--border)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Decoration */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, transparent 100%)', zIndex: 0, borderRadius: '0 0 0 100%' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-mid) 100%)', color: '#fff', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '800', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.25)' }}>
                        {profile?.nama?.charAt(0) || <User size={48} />}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#fff', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex' }}>
                        {profile?.role === 'admin' ? <ShieldCheck size={20} color="#ef4444" /> : <GraduationCap size={20} color="var(--accent)" />}
                    </div>
                </div>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{profile?.nama || 'Pengguna'}</h1>
                    <p style={{ color: 'var(--muted)', fontWeight: '600', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {profile?.role === 'admin' ? <><ShieldCheck size={18} /> Administrator Sistem</> : <><GraduationCap size={18} /> Mahasiswa Terverifikasi</>}
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <div style={{ padding: '1.8rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                        <Hash size={20} color="var(--accent)" />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>NIM</span>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--ink)' }}>{profile?.nim || '-'}</span>
                    </div>
                </div>
                <div style={{ padding: '1.8rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                        <Mail size={20} color="var(--accent)" />
                    </div>
                    <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Email Institusi</span>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--ink)' }}>{profile?.email || '-'}</span>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Statistik Aktivitas</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: '600' }}>Data diperbarui secara real-time</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '2.5rem', background: 'var(--found-bg)', borderRadius: '24px', border: '1.5px solid #d1fae5', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <Package size={28} color="var(--found)" />
                            </div>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--found)', lineHeight: 1 }}>{stats.found}</span>
                        </div>
                        <h4 style={{ color: 'var(--found)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>Laporan Temuan</h4>
                        <p style={{ color: 'var(--found)', fontSize: '0.85rem', opacity: 0.8 }}>Barang yang Anda temukan dan laporkan.</p>
                    </div>
                    {/* Decor */}
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
                        <Package size={120} color="var(--found)" />
                    </div>
                </div>

                <div style={{ padding: '2.5rem', background: 'var(--lost-bg)', borderRadius: '24px', border: '1.5px solid #fee2e2', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '14px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <Search size={28} color="var(--lost)" />
                            </div>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--lost)', lineHeight: 1 }}>{stats.lost}</span>
                        </div>
                        <h4 style={{ color: 'var(--lost)', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>Laporan Kehilangan</h4>
                        <p style={{ color: 'var(--lost)', fontSize: '0.85rem', opacity: 0.8 }}>Barang milik Anda yang dilaporkan hilang.</p>
                    </div>
                    {/* Decor */}
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
                        <Search size={120} color="var(--lost)" />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
                <button 
                    onClick={() => window.location.reload()}
                    style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    Sinkronisasi Ulang Data <ChevronRight size={16} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
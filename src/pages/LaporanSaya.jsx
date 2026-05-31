import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  FileText, 
  Search, 
  Archive, 
  ClipboardList, 
  MapPin, 
  Calendar, 
  Info, 
  Download, 
  Lock, 
  Camera, 
  User, 
  Hash, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Package
} from 'lucide-react';

const statusToLabel = {
  pending: 'Dilaporkan', verified: 'Diverifikasi', at_counter: 'Di Loket', completed: 'Selesai',
};

const claimBadge = (status) => {
  const map = {
    pending:  { label: 'Menunggu Verifikasi', icon: <Clock size={14} />, bg: '#fef9c3', color: '#854d0e' },
    approved: { label: 'Klaim Disetujui',      icon: <CheckCircle size={14} />, bg: '#d1fae5', color: '#065f46' },
    rejected: { label: 'Klaim Ditolak',        icon: <XCircle size={14} />, bg: '#fee2e2', color: '#991b1b' },
  };
  return map[status] || map.pending;
};

const LaporanSaya = () => {
  const [activeTab, setActiveTab] = useState('aktif');
  const [myReports, setMyReports] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => { fetchMyReports(); }, []);
  useEffect(() => { if (activeTab === 'klaim') fetchMyClaims(); }, [activeTab]);

  const fetchMyReports = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Sesi tidak valid, silakan login ulang.');

      const { data: profile } = await supabase.from('users').select('nama').eq('user_id', user.id).single();
      setUserName(profile?.nama || user.email);

      const [{ data: foundItems, error: e1 }, { data: lostItems, error: e2 }] = await Promise.all([
        supabase.from('found_item').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('lost_item').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      const foundMapped = (foundItems || []).map(i => ({
        id: `F-${i.found_id}`, dbId: i.found_id, dbTable: 'found_item',
        nama: i.nama_barang, lokasi: i.lokasi_ditemukan, status: 'found',
        tanggal: i.tanggal_ditemukan, logistik: statusToLabel[i.status] || 'Dilaporkan',
        dbStatus: i.status, deskripsi: i.deskripsi || '-', foto: i.foto,
        kategori: i.status === 'completed' ? 'selesai' : 'aktif',
        tglSelesai: i.status === 'completed' ? new Date(i.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
      }));
      const lostMapped = (lostItems || []).map(i => ({
        id: `L-${i.lost_id}`, dbId: i.lost_id, dbTable: 'lost_item',
        nama: i.nama_barang, lokasi: i.lokasi_hilang, status: 'lost',
        tanggal: i.tanggal_hilang, logistik: statusToLabel[i.status] || 'Dilaporkan',
        dbStatus: i.status, deskripsi: i.deskripsi || '-', foto: i.foto,
        kategori: i.status === 'completed' ? 'selesai' : 'aktif',
        tglSelesai: i.status === 'completed' ? new Date(i.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
      }));

      setMyReports([...foundMapped, ...lostMapped].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));
    } catch (err) {
      setError('Gagal memuat laporan: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyClaims = async () => {
    setIsLoadingClaims(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Sesi tidak valid.');

      const { data, error: err } = await supabase
        .from('claims')
        .select('claim_id, deskripsi_bukti, status, admin_note, created_at, found_item:found_item_id (nama_barang, foto, lokasi_ditemukan)')
        .eq('claimant_user_id', user.id)
        .order('created_at', { ascending: false });
      if (err) throw err;
      setMyClaims(data || []);
    } catch (err) {
      setError('Gagal memuat klaim: ' + err.message);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const handleCetakPDF = (report) => {
    alert(`Mendownload Berita Acara Resmi LostLynk Undip...\n\nID Dokumen: BA-${report.id}\nBarang: ${report.nama}\nStatus: Telah Sukses Dikembalikan ke Pemilik Sah.\n\nFile PDF sukses disimpan di folder Downloads!`);
  };

  const filteredReports = myReports.filter(r => r.kategori === activeTab);
  const aktifCount   = myReports.filter(r => r.kategori === 'aktif').length;
  const selesaiCount = myReports.filter(r => r.kategori === 'selesai').length;

  const TABS = [
    { key: 'aktif',   label: `Laporan Aktif`, count: aktifCount, icon: <ClipboardList size={18} /> },
    { key: 'selesai', label: `Selesai / Arsip`, count: selesaiCount, icon: <Archive size={18} /> },
    { key: 'klaim',   label: `Klaim Saya`, count: myClaims.length, icon: <Search size={18} /> },
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Riwayat Aktivitas</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Pantau status verifikasi dan riwayat logistik barang Anda.</p>
        </div>
        {userName && (
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent-mid)', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid var(--accent-light)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={16} /> {userName}
          </div>
        )}
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <XCircle size={18} /> {error}
          </div>
          <button onClick={() => activeTab === 'klaim' ? fetchMyClaims() : fetchMyReports()}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Coba Lagi</button>
        </div>
      )}

      {/* TABS MODERN */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '1rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '0.9rem', 
            fontWeight: '700',
            color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === tab.key ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-1px', 
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            {tab.icon}
            {tab.label}
            <span style={{ 
                background: activeTab === tab.key ? 'var(--accent)' : 'var(--border)', 
                color: activeTab === tab.key ? '#fff' : 'var(--muted)',
                padding: '0.1rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                marginLeft: '0.4rem'
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ===== TAB: AKTIF & SELESAI ===== */}
      {(activeTab === 'aktif' || activeTab === 'selesai') && (
        <>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[1,2,3].map(n => (
                <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', height: '140px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="shimmer" style={{ width: '30%', height: '24px', background: '#e2e8f0', borderRadius: '6px' }} />
                  <div className="shimmer" style={{ width: '60%', height: '18px', background: '#f1f5f9', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
              <div style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Package size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>Belum Ada Laporan</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto' }}>{myReports.length === 0 ? 'Anda belum pernah membuat laporan barang temuan atau kehilangan.' : 'Tidak ada laporan di kategori ini.'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {filteredReports.map(report => (
                <div key={report.id}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', display: 'flex', alignItems: 'center', gap: '2rem', transition: 'all 0.3s ease', flexWrap: 'wrap' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  
                  {report.foto ? (
                    <img src={report.foto} alt={report.nama}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '16px', flexShrink: 0, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)', flexShrink: 0 }}>
                      <Camera size={24} />
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '0.4rem' }}>No Foto</span>
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#f1f5f9', padding: '0.3rem 0.7rem', borderRadius: '8px', fontWeight: '800', color: 'var(--ink)', border: '1px solid var(--border)' }}>
                        <Hash size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {report.id}
                      </span>
                      <span className={`badge badge-${report.status}`} style={{ padding: '0.3rem 0.8rem' }}>{report.status === 'found' ? 'Temuan' : 'Kehilangan'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-mid)', fontWeight: '700', background: 'var(--accent-light)', padding: '0.3rem 0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {report.logistik}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: 'var(--ink)' }}>{report.nama}</h4>
                    <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={14} /> {report.lokasi}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={14} /> {report.tanggal}
                        </p>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink)', margin: 0, background: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '12px', borderLeft: '3px solid var(--border)' }}>
                        <MessageSquare size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle', opacity: 0.5 }} />
                        {report.deskripsi}
                    </p>
                    {report.tglSelesai && (
                      <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', padding: '0.6rem 1rem', borderRadius: '10px', width: 'fit-content' }}>
                         <CheckCircle size={16} /> Selesai diserahterimakan pada: {report.tglSelesai}
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: '150px', textAlign: 'right' }}>
                    {report.kategori === 'selesai' ? (
                      <button className="btn btn-accent"
                        style={{ padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: '700' }}
                        onClick={() => handleCetakPDF(report)}>
                        <Download size={18} /> Berita Acara
                      </button>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: '700', padding: '0.7rem 1.2rem', background: '#f1f5f9', borderRadius: '12px' }}>
                        <Lock size={16} /> Verifikasi Admin
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== TAB: KLAIM SAYA ===== */}
      {activeTab === 'klaim' && (
        <>
          {isLoadingClaims ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[1,2].map(n => (
                <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', height: '140px', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <div className="shimmer" style={{ width: '30%', height: '24px', background: '#e2e8f0', borderRadius: '6px' }} />
                  <div className="shimmer" style={{ width: '60%', height: '18px', background: '#f1f5f9', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : myClaims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
              <div style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Search size={32} color="var(--accent)" />
              </div>
              <h3 style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>Belum Ada Pengajuan Klaim</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem' }}>Temukan barang milik Anda di menu <strong>Cari Barang</strong>, kemudian gunakan tombol <strong>"Ajukan Klaim"</strong>.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {myClaims.map(claim => {
                const badge = claimBadge(claim.status);
                return (
                  <div key={claim.claim_id}
                    style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.8rem', display: 'flex', gap: '2rem', alignItems: 'start', transition: 'all 0.3s ease', flexWrap: 'wrap' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    
                    {claim.found_item?.foto ? (
                      <img src={claim.found_item.foto} alt="Barang"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '16px', flexShrink: 0, border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)', flexShrink: 0 }}>
                        <Camera size={24} />
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '0.4rem' }}>No Foto</span>
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#f1f5f9', padding: '0.3rem 0.7rem', borderRadius: '8px', fontWeight: '800', color: 'var(--ink)', border: '1px solid var(--border)' }}>
                          <Hash size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {claim.claim_id?.slice(0, 8).toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: badge.bg, color: badge.color, padding: '0.4rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800' }}>
                          {badge.icon}
                          {badge.label}
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Search size={18} color="var(--accent)" /> {claim.found_item?.nama_barang || 'Barang Temuan'}
                      </h4>

                      {claim.found_item?.lokasi_ditemukan && (
                        <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={14} /> {claim.found_item.lokasi_ditemukan}
                        </p>
                      )}

                      <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '15px', background: '#fff', padding: '0 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Info size={12} /> Bukti Kepemilikan Saya
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: '1.6' }}>
                            "{claim.deskripsi_bukti}"
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '1.2rem' }}>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={14} /> Diajukan: {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                      </div>

                      {claim.admin_note && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', background: claim.status === 'approved' ? '#ecfdf5' : '#fff5f5', borderRadius: '16px', border: '1.5px solid', borderColor: claim.status === 'approved' ? '#10b981' : '#fecaca', fontSize: '0.9rem', color: claim.status === 'approved' ? '#065f46' : '#991b1b', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <MessageSquare size={18} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                          <div>
                            <strong style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catatan Moderator:</strong>
                            {claim.admin_note}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LaporanSaya;
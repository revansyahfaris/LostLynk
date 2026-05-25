import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const statusToLabel = {
  pending: 'Dilaporkan', verified: 'Diverifikasi', at_counter: 'Di Loket', completed: 'Selesai',
};

const claimBadge = (status) => {
  const map = {
    pending:  { label: '⏳ Menunggu Verifikasi', bg: '#fef9c3', color: '#854d0e' },
    approved: { label: '✅ Klaim Disetujui',      bg: '#d1fae5', color: '#065f46' },
    rejected: { label: '❌ Klaim Ditolak',        bg: '#fee2e2', color: '#991b1b' },
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
    alert(`📄 Mendownload Berita Acara Resmi LostLynk Undip...\n\nID Dokumen: BA-${report.id}\nBarang: ${report.nama}\nStatus: Telah Sukses Dikembalikan ke Pemilik Sah.\n\nFile PDF sukses disimpan di folder Downloads!`);
  };

  const filteredReports = myReports.filter(r => r.kategori === activeTab);
  const aktifCount   = myReports.filter(r => r.kategori === 'aktif').length;
  const selesaiCount = myReports.filter(r => r.kategori === 'selesai').length;

  const TABS = [
    { key: 'aktif',   label: `Laporan Aktif (${aktifCount})` },
    { key: 'selesai', label: `Selesai / Arsip (${selesaiCount})` },
    { key: 'klaim',   label: `Klaim Saya (${myClaims.length})` },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2>Riwayat Laporan Saya</h2>
        {userName && (
          <span style={{ background: 'var(--cream)', color: 'var(--accent-mid)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid var(--accent-light)' }}>
            USER: {userName}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Pantau status verifikasi logistik barang milikmu or cetak bukti serah terima resmi di sini.
      </p>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => activeTab === 'klaim' ? fetchMyClaims() : fetchMyReports()}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>Coba Lagi</button>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '0.8rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: activeTab === tab.key ? '600' : '400',
            color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === tab.key ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ===== TAB: AKTIF & SELESAI ===== */}
      {(activeTab === 'aktif' || activeTab === 'selesai') && (
        <>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1,2,3].map(n => (
                <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', height: '120px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div className="shimmer" style={{ width: '40%', height: '20px', background: '#e2e8f0', borderRadius: '4px' }} />
                  <div className="shimmer" style={{ width: '70%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              {myReports.length === 0 ? '📭 Kamu belum membuat laporan apapun.' : 'Tidak ada riwayat laporan di kategori ini.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredReports.map(report => (
                <div key={report.id}
                  style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {/* Foto asli jika ada */}
                  {report.foto ? (
                    <img src={report.foto} alt={report.nama}
                      style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: '85px', height: '85px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', border: '1px dashed #cbd5e1', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.3rem' }}>📷</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>No Foto</span>
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--cream)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', color: 'var(--ink)' }}>{report.id}</span>
                      <span className={`badge badge-${report.status}`}>{report.status === 'found' ? 'Temuan' : 'Kehilangan'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-mid)', fontWeight: '600', background: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        Status: {report.logistik}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.3rem 0' }}>{report.nama}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.4rem 0' }}>📍 {report.lokasi} | 📅 {report.tanggal}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>"{report.deskripsi}"</p>
                    {report.tglSelesai && (
                      <p style={{ fontSize: '0.8rem', color: '#10b981', margin: '0.5rem 0 0 0', fontWeight: '500' }}>
                         Selesai diserahterimakan pada: {report.tglSelesai}
                      </p>
                    )}
                  </div>
                  <div>
                    {report.kategori === 'selesai' ? (
                      <button className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#10b981', borderColor: '#10b981' }}
                        onClick={() => handleCetakPDF(report)}>📥 Cetak Bukti BA</button>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: '500', padding: '0.5rem 1rem', background: 'var(--cream)', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                        🔒 Diproses Admin
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[1,2].map(n => (
                <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', height: '120px', display: 'flex', gap: '0.8rem', flexDirection: 'column' }}>
                  <div className="shimmer" style={{ width: '40%', height: '20px', background: '#e2e8f0', borderRadius: '4px' }} />
                  <div className="shimmer" style={{ width: '70%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          ) : myClaims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🙋</div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Kamu belum mengajukan klaim apapun.</p>
              <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>Temukan barang milikmu di <strong>Cari Barang</strong> lalu klik "Ajukan Klaim".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myClaims.map(claim => {
                const badge = claimBadge(claim.status);
                return (
                  <div key={claim.claim_id}
                    style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: claim.found_item?.foto ? 'auto 1fr' : '1fr', gap: '1.5rem', alignItems: 'start', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                    {/* Foto asli jika ada */}
                    {claim.found_item?.foto ? (
                      <img src={claim.found_item.foto} alt="Barang"
                        style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid var(--border)' }} />
                    ) : (
                      <div style={{ width: '85px', height: '85px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', border: '1px dashed #cbd5e1', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.3rem' }}>📷</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '500' }}>No Foto</span>
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', background: 'var(--cream)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
                          #{claim.claim_id?.slice(0, 8)}
                        </span>
                        <span style={{ padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem' }}>
                        🔍 {claim.found_item?.nama_barang || 'Barang Temuan'}
                      </h4>
                      {claim.found_item?.lokasi_ditemukan && (
                        <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
                          📍 {claim.found_item.lokasi_ditemukan}
                        </p>
                      )}
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--ink)', background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', fontStyle: 'italic' }}>
                        📝 Bukti saya: "{claim.deskripsi_bukti}"
                      </p>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                        Diajukan: {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {claim.admin_note && (
                        <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: claim.status === 'approved' ? '#d1fae5' : '#fee2e2', borderRadius: '8px', fontSize: '0.83rem', color: claim.status === 'approved' ? '#065f46' : '#991b1b' }}>
                          📌 Catatan Admin: {claim.admin_note}
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

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const statusToStep = { pending: 1, verified: 2, at_counter: 3, completed: 4 };
const stepToStatus = { 1: 'pending', 2: 'verified', 3: 'at_counter', 4: 'completed' };

const getStepLabel = (step) => {
  switch (step) {
    case 1: return '📝 Dilaporkan';
    case 2: return '🔍 Diverifikasi';
    case 3: return '🏢 Di Loket';
    case 4: return '✅ Selesai (Arsip)';
    default: return 'Diproses';
  }
};

const claimBadge = (status) => {
  const map = {
    pending:  { label: 'Menunggu', bg: '#fef9c3', color: '#854d0e' },
    approved: { label: 'Disetujui', bg: '#d1fae5', color: '#065f46' },
    rejected: { label: 'Ditolak',  bg: '#fee2e2', color: '#991b1b' },
  };
  return map[status] || map.pending;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('laporan');
  const [laporanMasuk, setLaporanMasuk] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [processingClaim, setProcessingClaim] = useState(null);
  const [adminNotes, setAdminNotes] = useState({});

  useEffect(() => { fetchAllLaporan(); }, []);
  useEffect(() => { if (activeTab === 'klaim') fetchClaims(); }, [activeTab]);

  const fetchAllLaporan = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [{ data: foundItems, error: e1 }, { data: lostItems, error: e2 }] = await Promise.all([
        supabase.from('found_item')
          .select('found_id, user_id, nama_barang, lokasi_ditemukan, tanggal_ditemukan, status, foto, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('lost_item')
          .select('lost_id, user_id, nama_barang, lokasi_hilang, tanggal_hilang, status, foto, created_at')
          .order('created_at', { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      const allUserIds = [...new Set([
        ...(foundItems || []).map(i => i.user_id),
        ...(lostItems  || []).map(i => i.user_id),
      ])];
      let userMap = {};
      if (allUserIds.length > 0) {
        const { data: uData } = await supabase.from('users').select('user_id, nama').in('user_id', allUserIds);
        (uData || []).forEach(u => { userMap[u.user_id] = u.nama; });
      }

      const fmt = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

      const foundMapped = (foundItems || []).map(i => ({
        id: `F-${i.found_id}`, dbId: i.found_id, dbTable: 'found_item', dbPK: 'found_id',
        nama: i.nama_barang, lokasi: i.lokasi_ditemukan, status: 'found',
        tanggal: fmt(i.tanggal_ditemukan), step: statusToStep[i.status] || 1,
        pelapor: userMap[i.user_id] || `User-${i.user_id?.slice(0,6)}`, foto: i.foto,
      }));
      const lostMapped = (lostItems || []).map(i => ({
        id: `L-${i.lost_id}`, dbId: i.lost_id, dbTable: 'lost_item', dbPK: 'lost_id',
        nama: i.nama_barang, lokasi: i.lokasi_hilang, status: 'lost',
        tanggal: fmt(i.tanggal_hilang), step: statusToStep[i.status] || 1,
        pelapor: userMap[i.user_id] || `User-${i.user_id?.slice(0,6)}`, foto: i.foto,
      }));

      setLaporanMasuk([...foundMapped, ...lostMapped].sort((a, b) => a.step - b.step));
    } catch (err) {
      setError('Gagal memuat data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClaims = async () => {
    setIsLoadingClaims(true);
    try {
      const { data, error: err } = await supabase
        .from('claims')
        .select('claim_id, found_item_id, deskripsi_bukti, status, admin_note, created_at, claimant_user_id, found_item:found_item_id (nama_barang, foto)')
        .order('created_at', { ascending: false });
      if (err) throw err;

      const uids = [...new Set((data || []).map(c => c.claimant_user_id))];
      let uMap = {};
      if (uids.length > 0) {
        const { data: uData } = await supabase.from('users').select('user_id, nama').in('user_id', uids);
        (uData || []).forEach(u => { uMap[u.user_id] = u.nama; });
      }
      setClaims((data || []).map(c => ({ ...c, claimant_nama: uMap[c.claimant_user_id] || `User-${c.claimant_user_id?.slice(0,6)}` })));
    } catch (err) {
      setError('Gagal memuat klaim: ' + err.message);
    } finally {
      setIsLoadingClaims(false);
    }
  };

  const handleUpdateStep = async (item, newStep) => {
    if (newStep < 1 || newStep > 4) return;
    setUpdating(item.id);
    try {
      const { error: e } = await supabase.from(item.dbTable).update({ status: stepToStatus[newStep] }).eq(item.dbPK, item.dbId);
      if (e) throw e;
      setLaporanMasuk(prev => prev.map(i => i.id === item.id ? { ...i, step: newStep } : i));
    } catch (err) {
      alert('Gagal update status: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleClaimAction = async (claim, action) => {
    setProcessingClaim(claim.claim_id);
    try {
      const note = adminNotes[claim.claim_id] || '';
      const { error: e } = await supabase.from('claims').update({ status: action, admin_note: note }).eq('claim_id', claim.claim_id);
      if (e) throw e;
      if (action === 'approved') {
        await supabase.from('found_item').update({ status: 'at_counter' }).eq('found_id', claim.found_item_id);
      }
      await fetchClaims();
    } catch (err) {
      alert('Gagal proses klaim: ' + err.message);
    } finally {
      setProcessingClaim(null);
    }
  };

  // Batalkan approval — kembalikan klaim ke pending & status barang ke verified
  const handleCancelApproval = async (claim) => {
    const konfirmasi = window.confirm(
      `Batalkan approval klaim ini?\n\nBarang: ${claim.found_item?.nama_barang || '—'}\nPengklaim: ${claim.claimant_nama}\n\nKlaim akan kembali ke status Menunggu.`
    );
    if (!konfirmasi) return;

    setProcessingClaim(claim.claim_id);
    try {
      const { error: e1 } = await supabase
        .from('claims')
        .update({ status: 'pending', admin_note: '' })
        .eq('claim_id', claim.claim_id);
      if (e1) throw e1;

      // Kembalikan status found_item → verified (step sebelum at_counter)
      const { error: e2 } = await supabase
        .from('found_item')
        .update({ status: 'verified' })
        .eq('found_id', claim.found_item_id);
      if (e2) throw e2;

      await fetchClaims();
    } catch (err) {
      alert('Gagal membatalkan approval: ' + err.message);
    } finally {
      setProcessingClaim(null);
    }
  };

  // Batalkan reject — kembalikan klaim ke pending (barang tidak perlu diubah)
  const handleCancelRejection = async (claim) => {
    const konfirmasi = window.confirm(
      `Batalkan penolakan klaim ini?\n\nBarang: ${claim.found_item?.nama_barang || '—'}\nPengklaim: ${claim.claimant_nama}\n\nKlaim akan kembali ke status Menunggu.`
    );
    if (!konfirmasi) return;

    setProcessingClaim(claim.claim_id);
    try {
      const { error: e } = await supabase
        .from('claims')
        .update({ status: 'pending', admin_note: '' })
        .eq('claim_id', claim.claim_id);
      if (e) throw e;

      await fetchClaims();
    } catch (err) {
      alert('Gagal membatalkan penolakan: ' + err.message);
    } finally {
      setProcessingClaim(null);
    }
  };

  const filtered = laporanMasuk.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pelapor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = claims.filter(c => c.status === 'pending').length;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <img src={lightboxImg} alt="Foto Barang"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }} />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2>Pusat Kendali Logistik (Admin)</h2>
        <span style={{ background: '#fef2f2', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #fca5a5' }}>
           Akses Laboran Tekkom
        </span>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Otorisasi pembaruan status fisik barang temuan dan verifikasi kepemilikan tiket antrean.
      </p>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
        {[
          { key: 'laporan', label: 'Semua Laporan' },
          { key: 'klaim', label: `Klaim Masuk${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '0.7rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: activeTab === tab.key ? '700' : '400',
            color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === tab.key ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => { setError(''); activeTab === 'laporan' ? fetchAllLaporan() : fetchClaims(); }}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>Refresh</button>
        </div>
      )}

      {/* ===== TAB: LAPORAN ===== */}
      {activeTab === 'laporan' && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <input type="text" className="form-input"
              placeholder="🔍 Cari berdasarkan ID (ex: F-3), nama pelapor, atau nama barang..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ background: '#ffffff' }} />
          </div>

          {isLoading ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              ⏳ Memuat data laporan...
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Foto</th>
                    <th style={{ padding: '1rem' }}>Nama Barang / Pelapor</th>
                    <th style={{ padding: '1rem' }}>Lokasi / Tanggal</th>
                    <th style={{ padding: '1rem' }}>Tahapan</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
                      {laporanMasuk.length === 0 ? '📭 Belum ada laporan masuk.' : `❌ Tidak cocok dengan "${searchQuery}"`}
                    </td></tr>
                  ) : filtered.map(item => (
                    <tr key={item.id}
                      style={{ borderBottom: '1px solid var(--border)', opacity: updating === item.id ? 0.6 : 1 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {/* ID */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{item.id}</div>
                        <span className={`badge badge-${item.status}`} style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>
                          {item.status === 'found' ? 'Temuan' : 'Kehilangan'}
                        </span>
                      </td>
                      {/* FOTO */}
                      <td style={{ padding: '1rem' }}>
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama}
                            onClick={() => setLightboxImg(item.foto)}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in', border: '1px solid var(--border)', transition: 'transform 0.2s' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                        ) : (
                          <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#cbd5e1', border: '1px dashed #cbd5e1' }}>
                            <span>📷</span>
                            <span style={{ fontSize: '0.55rem', fontWeight: '500' }}>No Foto</span>
                          </div>
                        )}
                      </td>
                      {/* NAMA & PELAPOR */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{item.nama}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>👤 {item.pelapor}</span>
                      </td>
                      {/* LOKASI & TANGGAL */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>📍 {item.lokasi}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📅 {item.tanggal}</span>
                      </td>
                      {/* STEP */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', background: item.step === 4 ? '#d1fae5' : 'var(--accent-light)', color: item.step === 4 ? '#065f46' : 'var(--accent-mid)' }}>
                          {getStepLabel(item.step)}
                        </span>
                      </td>
                      {/* AKSI */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                          <button onClick={() => handleUpdateStep(item, item.step - 1)}
                            disabled={item.step === 1 || updating === item.id}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: item.step === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: item.step === 1 ? 0.4 : 1 }}>
                            ◀ Mundur
                          </button>
                          <button onClick={() => handleUpdateStep(item, item.step + 1)}
                            disabled={item.step === 4 || updating === item.id}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--accent)', background: item.step === 4 ? '#cbd5e1' : 'var(--accent)', color: item.step === 4 ? '#94a3b8' : '#fff', cursor: item.step === 4 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                            {updating === item.id ? '⏳' : item.step === 3 ? 'Selesaikan ✓' : 'Maju ▶'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && laporanMasuk.length > 0 && (
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right' }}>
              Total: {laporanMasuk.length} | Aktif: {laporanMasuk.filter(i => i.step < 4).length} | Selesai: {laporanMasuk.filter(i => i.step === 4).length}
            </div>
          )}
        </>
      )}

      {/* ===== TAB: KLAIM MASUK ===== */}
      {activeTab === 'klaim' && (
        <>
          {isLoadingClaims ? (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              ⏳ Memuat data klaim...
            </div>
          ) : claims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
              📭 Belum ada klaim masuk.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {claims.map(claim => {
                const badge = claimBadge(claim.status);
                return (
                  <div key={claim.claim_id}
                    style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                    {claim.found_item?.foto ? (
                      <img src={claim.found_item.foto} alt="Barang"
                        onClick={() => setLightboxImg(claim.found_item.foto)}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', cursor: 'zoom-in', border: '1px solid var(--border)', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', border: '1px dashed #cbd5e1', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.2rem' }}>📷</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: '500' }}>No Foto</span>
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8rem', fontFamily: 'monospace', background: 'var(--cream)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          #{claim.claim_id?.slice(0, 8)}
                        </span>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600', background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem' }}>
                        🔍 Klaim: <em>{claim.found_item?.nama_barang || '—'}</em>
                      </h4>
                      <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
                        👤 Pengklaim: <strong>{claim.claimant_nama}</strong>
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--ink)', background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', fontStyle: 'italic' }}>
                         Bukti: "{claim.deskripsi_bukti}"
                      </p>
                      {claim.admin_note && (
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>📌 Catatan Admin: {claim.admin_note}</p>
                      )}
                    </div>
                    {claim.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '155px' }}>
                        <input type="text" placeholder="Catatan admin (opsional)"
                          value={adminNotes[claim.claim_id] || ''}
                          onChange={e => setAdminNotes(prev => ({ ...prev, [claim.claim_id]: e.target.value }))}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }} />
                        <button onClick={() => handleClaimAction(claim, 'approved')}
                          disabled={processingClaim === claim.claim_id}
                          style={{ padding: '0.45rem 0.8rem', borderRadius: '6px', border: '1px solid #10b981', background: '#10b981', color: '#fff', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
                          {processingClaim === claim.claim_id ? '⏳...' : 'Approve'}
                        </button>
                        <button onClick={() => handleClaimAction(claim, 'rejected')}
                          disabled={processingClaim === claim.claim_id}
                          style={{ padding: '0.45rem 0.8rem', borderRadius: '6px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Tombol cancel khusus klaim yang sudah approved — antisipasi misclick */}
                    {claim.status === 'approved' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '155px' }}>
                        <div style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', background: '#d1fae5', color: '#065f46', fontSize: '0.78rem', fontWeight: '600', textAlign: 'center' }}>
                          Sudah Disetujui
                        </div>
                        <button
                          onClick={() => handleCancelApproval(claim)}
                          disabled={processingClaim === claim.claim_id}
                          style={{
                            padding: '0.45rem 0.8rem', borderRadius: '6px',
                            border: '1px solid #f59e0b', background: '#fffbeb',
                            color: '#92400e', fontWeight: '600', fontSize: '0.82rem',
                            cursor: processingClaim === claim.claim_id ? 'not-allowed' : 'pointer',
                            opacity: processingClaim === claim.claim_id ? 0.6 : 1,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { if (processingClaim !== claim.claim_id) { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.borderColor = '#d97706'; }}}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.borderColor = '#f59e0b'; }}
                        >
                          {processingClaim === claim.claim_id ? '⏳...' : 'Batalkan Approval'}
                        </button>
                      </div>
                    )}

                    {/* Tombol cancel khusus klaim yang sudah rejected — antisipasi misclick */}
                    {claim.status === 'rejected' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '155px' }}>
                        <div style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', fontSize: '0.78rem', fontWeight: '600', textAlign: 'center' }}>
                          Sudah Ditolak
                        </div>
                        <button
                          onClick={() => handleCancelRejection(claim)}
                          disabled={processingClaim === claim.claim_id}
                          style={{
                            padding: '0.45rem 0.8rem', borderRadius: '6px',
                            border: '1px solid #f59e0b', background: '#fffbeb',
                            color: '#92400e', fontWeight: '600', fontSize: '0.82rem',
                            cursor: processingClaim === claim.claim_id ? 'not-allowed' : 'pointer',
                            opacity: processingClaim === claim.claim_id ? 0.6 : 1,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { if (processingClaim !== claim.claim_id) { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.borderColor = '#d97706'; }}}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fffbeb'; e.currentTarget.style.borderColor = '#f59e0b'; }}
                        >
                          {processingClaim === claim.claim_id ? '⏳...' : 'Batalkan Penolakan'}
                        </button>
                      </div>
                    )}
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

export default AdminDashboard;

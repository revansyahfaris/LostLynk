import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  ShieldCheck, 
  Search, 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ClipboardList, 
  Camera, 
  X,
  Check,
  Ban,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Lock,
  Hash
} from 'lucide-react';

const statusToStep = { pending: 1, verified: 2, at_counter: 3, completed: 4 };
const stepToStatus = { 1: 'pending', 2: 'verified', 3: 'at_counter', 4: 'completed' };

const getStepLabel = (step) => {
  switch (step) {
    case 1: return { label: 'Dilaporkan', icon: <Clock size={14} />, color: '#64748b', bg: '#f1f5f9' };
    case 2: return { label: 'Diverifikasi', icon: <Search size={14} />, color: '#0ea5e9', bg: '#f0f9ff' };
    case 3: return { label: 'Di Loket', icon: <Package size={14} />, color: '#8b5cf6', bg: '#f5f3ff' };
    case 4: return { label: 'Selesai', icon: <CheckCircle2 size={14} />, color: '#10b981', bg: '#ecfdf5' };
    default: return { label: 'Diproses', icon: <Clock size={14} />, color: '#64748b', bg: '#f1f5f9' };
  }
};

const claimBadge = (status) => {
  const map = {
    pending:  { label: 'Menunggu', icon: <Clock size={14} />, bg: '#fef9c3', color: '#854d0e' },
    approved: { label: 'Disetujui', icon: <CheckCircle2 size={14} />, bg: '#d1fae5', color: '#065f46' },
    rejected: { label: 'Ditolak',  icon: <Ban size={14} />, bg: '#fee2e2', color: '#991b1b' },
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
    <div className="container" style={{ paddingTop: '2.5rem' }}>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', backdropFilter: 'blur(8px)' }}>
          <img src={lightboxImg} alt="Foto Barang"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }} />
          <button onClick={() => setLightboxImg(null)}
            style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#fff', border: 'none', color: '#000', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                <X size={20} />
            </button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <ShieldCheck size={28} color="var(--accent)" /> Admin Dashboard
            </h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Otorisasi logistik dan verifikasi klaim kepemilikan barang.</p>
        </div>
        <div style={{ background: '#fff1f2', color: '#e11d48', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #ffe4e6', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
           <Lock size={16} /> Restricted Access
        </div>
      </div>

      {/* TABS MODERN */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'laporan', label: 'Semua Laporan', icon: <ClipboardList size={18} /> },
          { key: 'klaim', label: `Klaim Masuk`, count: pendingCount, icon: <Search size={18} /> },
        ].map(tab => (
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
            {tab.count !== undefined && (
                <span style={{ 
                    background: activeTab === tab.key ? 'var(--accent)' : 'var(--border)', 
                    color: activeTab === tab.key ? '#fff' : 'var(--muted)',
                    padding: '0.1rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    marginLeft: '0.4rem'
                }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
          <button onClick={() => { setError(''); activeTab === 'laporan' ? fetchAllLaporan() : fetchClaims(); }}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RefreshCw size={14} /> Refresh
            </button>
        </div>
      )}

      {/* ===== TAB: LAPORAN ===== */}
      {activeTab === 'laporan' && (
        <>
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input type="text" className="form-input"
              placeholder="Cari berdasarkan ID, nama pelapor, atau nama barang..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff' }} />
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: '#fff', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--accent-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontWeight: '600' }}>Sinkronisasi Database...</p>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '1.2rem', color: 'var(--muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>ID / Status</th>
                        <th style={{ padding: '1.2rem', color: 'var(--muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Informasi Barang</th>
                        <th style={{ padding: '1.2rem', color: 'var(--muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Lokasi & Waktu</th>
                        <th style={{ padding: '1.2rem', color: 'var(--muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Tahapan</th>
                        <th style={{ padding: '1.2rem', color: 'var(--muted)', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px', textAlign: 'center' }}>Kontrol Otoritas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '5rem', textAlign: 'center', color: 'var(--muted)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Package size={48} strokeWidth={1} />
                            <p style={{ margin: 0, fontWeight: '500' }}>{laporanMasuk.length === 0 ? 'Belum ada laporan yang masuk.' : `Tidak ada hasil untuk "${searchQuery}"`}</p>
                        </div>
                        </td></tr>
                    ) : filtered.map(item => {
                        const stepConfig = getStepLabel(item.step);
                        return (
                        <tr key={item.id}
                        style={{ borderBottom: '1px solid var(--border)', opacity: updating === item.id ? 0.6 : 1, transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {/* ID */}
                        <td style={{ padding: '1.2rem' }}>
                            <div style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--ink)', fontSize: '1rem', marginBottom: '0.3rem' }}>{item.id}</div>
                            <span className={`badge badge-${item.status}`} style={{ fontSize: '0.7rem' }}>
                            {item.status === 'found' ? 'Temuan' : 'Kehilangan'}
                            </span>
                        </td>
                        {/* INFO BARANG */}
                        <td style={{ padding: '1.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {item.foto ? (
                                <img src={item.foto} alt={item.nama}
                                    onClick={() => setLightboxImg(item.foto)}
                                    style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', cursor: 'zoom-in', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                                ) : (
                                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)' }}>
                                    <Camera size={20} />
                                </div>
                                )}
                                <div>
                                    <div style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.95rem' }}>{item.nama}</div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <User size={12} /> {item.pelapor}
                                    </span>
                                </div>
                            </div>
                        </td>
                        {/* LOKASI & TANGGAL */}
                        <td style={{ padding: '1.2rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <MapPin size={14} color="var(--accent)" /> {item.lokasi}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Calendar size={14} /> {item.tanggal}
                            </div>
                        </td>
                        {/* STEP */}
                        <td style={{ padding: '1.2rem' }}>
                            <div style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                padding: '0.4rem 0.8rem', 
                                borderRadius: '10px', 
                                fontSize: '0.8rem', 
                                fontWeight: '700', 
                                background: stepConfig.bg, 
                                color: stepConfig.color 
                            }}>
                                {stepConfig.icon}
                                {stepConfig.label}
                            </div>
                        </td>
                        {/* AKSI */}
                        <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px' }}>
                            <button onClick={() => handleUpdateStep(item, item.step - 1)}
                                disabled={item.step === 1 || updating === item.id}
                                title="Mundur ke Tahap Sebelumnya"
                                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: 'none', background: item.step === 1 ? 'transparent' : '#fff', color: item.step === 1 ? '#cbd5e1' : 'var(--ink)', cursor: item.step === 1 ? 'not-allowed' : 'pointer', boxShadow: item.step === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={() => handleUpdateStep(item, item.step + 1)}
                                disabled={item.step === 4 || updating === item.id}
                                title={item.step === 3 ? "Tandai Selesai & Arsipkan" : "Lanjut ke Tahap Berikutnya"}
                                style={{ width: item.step === 3 ? 'auto' : '36px', height: '36px', padding: item.step === 3 ? '0 1rem' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: 'none', background: item.step === 4 ? '#cbd5e1' : 'var(--accent)', color: '#fff', cursor: item.step === 4 ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '0.8rem', gap: '0.5rem', boxShadow: item.step === 4 ? 'none' : '0 4px 6px rgba(14, 165, 233, 0.2)' }}>
                                {updating === item.id ? (
                                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                ) : item.step === 3 ? (
                                    <><Check size={18} /> Selesaikan</>
                                ) : (
                                    <ChevronRight size={20} />
                                )}
                            </button>
                            </div>
                        </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {!isLoading && laporanMasuk.length > 0 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Total: <strong>{laporanMasuk.length}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-mid)' }}>Aktif: <strong>{laporanMasuk.filter(i => i.step < 4).length}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: '#10b981' }}>Selesai: <strong>{laporanMasuk.filter(i => i.step === 4).length}</strong></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} /> Sinkronisasi terakhir: {new Date().toLocaleTimeString('id-ID')}
              </div>
            </div>
          )}
        </>
      )}

      {/* ===== TAB: KLAIM MASUK ===== */}
      {activeTab === 'klaim' && (
        <>
          {isLoadingClaims ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: '#fff', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--accent-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontWeight: '600' }}>Memuat Antrean Klaim...</p>
            </div>
          ) : claims.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '24px', border: '1px dashed var(--border)', color: 'var(--muted)' }}>
                <div style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Search size={32} color="var(--accent)" />
                </div>
              <h3 style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>Tidak Ada Antrean</h3>
              <p style={{ margin: 0 }}>Saat ini belum ada pengajuan klaim baru dari mahasiswa.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {claims.map(claim => {
                const badge = claimBadge(claim.status);
                return (
                  <div key={claim.claim_id}
                    style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'start', transition: 'all 0.3s ease', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    
                    {/* Background Status Indicator */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: badge.color }} />

                    {claim.found_item?.foto ? (
                      <img src={claim.found_item.foto} alt="Barang"
                        onClick={() => setLightboxImg(claim.found_item.foto)}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '16px', cursor: 'zoom-in', border: '1px solid var(--border)', flexShrink: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                    ) : (
                      <div style={{ width: '100px', height: '100px', borderRadius: '16px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)', flexShrink: 0 }}>
                        <Camera size={28} />
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', marginTop: '0.4rem' }}>No Foto</span>
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem', fontFamily: 'monospace', background: '#f1f5f9', padding: '0.3rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--ink)' }}>
                          <Hash size={12} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {claim.claim_id?.slice(0, 8).toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: badge.bg, color: badge.color, padding: '0.4rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800' }}>
                          {badge.icon}
                          {badge.label}
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.25rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Search size={20} color="var(--accent)" /> {claim.found_item?.nama_barang || '—'}
                      </h4>

                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--ink)', fontWeight: '600' }}>
                            <User size={16} color="var(--muted)" /> {claim.claimant_nama}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                            <Calendar size={16} /> {new Date(claim.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border)', position: 'relative', marginBottom: claim.admin_note ? '1.5rem' : 0 }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '15px', background: '#fff', padding: '0 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MessageSquare size={12} /> Bukti Kepemilikan Mahasiswa
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--ink)', lineHeight: '1.6', fontStyle: 'italic' }}>
                            "{claim.deskripsi_bukti}"
                        </p>
                      </div>

                      {claim.admin_note && (
                        <div style={{ padding: '1rem 1.5rem', background: claim.status === 'approved' ? '#ecfdf5' : '#fff5f5', borderRadius: '16px', border: '1.5px solid', borderColor: claim.status === 'approved' ? '#10b981' : '#fecaca', fontSize: '0.9rem', color: claim.status === 'approved' ? '#065f46' : '#991b1b', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <AlertCircle size={18} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                            <div>
                                <strong style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catatan Moderator:</strong>
                                {claim.admin_note}
                            </div>
                        </div>
                      )}
                    </div>

                    <div style={{ minWidth: '220px', paddingLeft: '1.5rem', borderLeft: '1px dashed var(--border)' }}>
                      {claim.status === 'pending' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Verifikasi Admin</label>
                            <textarea placeholder="Tulis catatan verifikasi di sini..."
                                value={adminNotes[claim.claim_id] || ''}
                                onChange={e => setAdminNotes(prev => ({ ...prev, [claim.claim_id]: e.target.value }))}
                                style={{ width: '100%', padding: '0.8rem', fontSize: '0.85rem', border: '1.5px solid var(--border)', borderRadius: '12px', outline: 'none', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <button onClick={() => handleClaimAction(claim, 'approved')}
                                disabled={processingClaim === claim.claim_id}
                                style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: '#10b981', color: '#fff', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                                {processingClaim === claim.claim_id ? (
                                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                ) : <><Check size={18} /> Terima</>}
                            </button>
                            <button onClick={() => handleClaimAction(claim, 'rejected')}
                                disabled={processingClaim === claim.claim_id}
                                style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <Ban size={18} /> Tolak
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ padding: '1rem', borderRadius: '16px', background: claim.status === 'approved' ? '#ecfdf5' : '#fff5f5', color: claim.status === 'approved' ? '#065f46' : '#991b1b', fontSize: '0.85rem', fontWeight: '800', marginBottom: '1rem', border: '1px solid', borderColor: claim.status === 'approved' ? '#d1fae5' : '#fee2e2' }}>
                                Keputusan: {claim.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                            </div>
                            <button
                                onClick={() => claim.status === 'approved' ? handleCancelApproval(claim) : handleCancelRejection(claim)}
                                disabled={processingClaim === claim.claim_id}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem', borderRadius: '12px',
                                    border: '1.5px solid #cbd5e1', background: '#fff',
                                    color: 'var(--muted)', fontWeight: '700', fontSize: '0.85rem',
                                    cursor: processingClaim === claim.claim_id ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { if (processingClaim !== claim.claim_id) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--ink)'; }}}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = 'var(--muted)'; }}
                            >
                                {processingClaim === claim.claim_id ? (
                                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'var(--muted)' }}></div>
                                ) : <><RefreshCw size={16} /> Revisi Keputusan</>}
                            </button>
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

export default AdminDashboard;
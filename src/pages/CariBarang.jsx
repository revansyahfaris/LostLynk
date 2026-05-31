import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Search as SearchIcon, Filter, MapPin, Calendar, Clock, CameraOff, X, Package, ShieldCheck, Send, CheckCircle, ArrowRight } from 'lucide-react';

const statusToStep = { pending: 1, verified: 2, at_counter: 3, completed: 4 };

const CariBarang = () => {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // State fitur klaim
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimDeskripsi, setClaimDeskripsi] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    setShowClaimForm(false);
    setClaimDeskripsi('');
    setClaimSuccess(false);
  }, [selectedBarang]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [{ data: foundItems, error: e1 }, { data: lostItems, error: e2 }] = await Promise.all([
        supabase.from('found_item').select('*').neq('status', 'completed').order('created_at', { ascending: false }),
        supabase.from('lost_item').select('*').neq('status', 'completed').order('created_at', { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;

      const foundMapped = (foundItems || []).map(i => ({
        id: `F-${i.found_id}`, dbId: i.found_id, dbTable: 'found_item',
        nama: i.nama_barang, lokasi: i.lokasi_ditemukan, status: 'found',
        tanggal: i.tanggal_ditemukan, step: statusToStep[i.status] || 1,
        deskripsi: i.deskripsi || '-', foto: i.foto,
        petugas: 'Admin LostLynk – Loket Teknik Komputer',
      }));
      const lostMapped = (lostItems || []).map(i => ({
        id: `L-${i.lost_id}`, dbId: i.lost_id, dbTable: 'lost_item',
        nama: i.nama_barang, lokasi: i.lokasi_hilang, status: 'lost',
        tanggal: i.tanggal_hilang, step: statusToStep[i.status] || 1,
        deskripsi: i.deskripsi || '-', foto: i.foto,
        petugas: 'Mandiri (Laporan Pemilik Asli)',
      }));

      setItems([...foundMapped, ...lostMapped].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)));
    } catch (err) {
      setError('Gagal memuat data. Periksa koneksi atau coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAksiDetail = (item) => {
    setSelectedBarang(item);
  };

  const handleSubmitClaim = async () => {
    if (!claimDeskripsi.trim()) {
      alert('Harap isi deskripsi bukti kepemilikan!');
      return;
    }
    setIsSubmittingClaim(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error('Sesi tidak valid, silakan login ulang.');

      const { error: insertErr } = await supabase.from('claims').insert({
        claimant_user_id: user.id,
        found_item_id: selectedBarang.dbId,
        deskripsi_bukti: claimDeskripsi.trim(),
        status: 'pending',
      });
      if (insertErr) throw insertErr;

      setClaimSuccess(true);
      setClaimDeskripsi('');
    } catch (err) {
      alert('Gagal mengajukan klaim: ' + err.message);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const filteredData = items.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.lokasi.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="container" style={{ paddingTop: '2rem', position: 'relative' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Galeri Temuan & Kehilangan</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>
                Telusuri database logistik barang hilang di lingkungan kampus.
            </p>
        </div>
        <div style={{ background: 'var(--cream)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-mid)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} /> {filteredData.length} Laporan Aktif
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <ShieldCheck size={18} /> {error}
          </div>
          <button onClick={fetchItems} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>Coba Lagi</button>
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                <SearchIcon size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input className="form-input" type="text"
                  placeholder="Cari nama barang atau lokasi..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1.5px solid var(--border)', outline: 'none', transition: 'all 0.3s' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Filter size={18} color="var(--muted)" style={{ marginRight: '0.5rem' }} />
                {['all', 'found', 'lost'].map(type => (
                    <button key={type} onClick={() => setStatusFilter(type)}
                    style={{ 
                        padding: '0.6rem 1.2rem', 
                        borderRadius: '10px', 
                        border: '1.5px solid', 
                        borderColor: statusFilter === type ? 'var(--accent)' : 'var(--border)',
                        fontSize: '0.85rem', 
                        fontWeight: '600',
                        cursor: 'pointer', 
                        transition: 'all 0.2s', 
                        background: statusFilter === type ? 'var(--accent)' : '#fff', 
                        color: statusFilter === type ? '#fff' : 'var(--muted)' 
                    }}>
                    {type === 'all' ? 'Semua' : type === 'found' ? 'Temuan' : 'Kehilangan'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* GRID KARTU */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {isLoading ? (
          [1,2,3,4,5,6].map(n => (
            <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.2rem', height: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="shimmer" style={{ width: '100%', height: '180px', background: '#f1f5f9', borderRadius: '12px' }} />
              <div className="shimmer" style={{ width: '40%', height: '20px', background: '#f1f5f9', borderRadius: '6px' }} />
              <div className="shimmer" style={{ width: '90%', height: '28px', background: '#e2e8f0', borderRadius: '6px' }} />
            </div>
          ))
        ) : filteredData.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', color: 'var(--muted)', background: '#fff', borderRadius: '20px', border: '1px dashed var(--border)' }}>
            <div style={{ background: 'var(--cream)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <SearchIcon size={32} color="var(--accent)" />
            </div>
            <h3 style={{ color: 'var(--ink)', marginBottom: '0.5rem' }}>Laporan Tidak Ditemukan</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto' }}>{items.length === 0 ? 'Belum ada laporan barang yang masuk ke sistem kami.' : `Tidak ada hasil pencarian yang cocok dengan kata kunci "${search}".`}</p>
          </div>
        ) : filteredData.map(item => (
          <div key={item.id}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.2rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            onClick={() => handleAksiDetail(item)}>
            
            {/* Tag Status di Pojok Kanan Atas */}
            <div style={{ position: 'absolute', top: '1.8rem', right: '1.8rem', zIndex: 5 }}>
                <span className={`badge badge-${item.status}`} style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '0.4rem 0.8rem' }}>
                    {item.status === 'found' ? 'Temuan' : 'Kehilangan'}
                </span>
            </div>

            {item.foto ? (
              <img src={item.foto} alt={item.nama}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1.2rem', border: '1px solid var(--border)' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', borderRadius: '14px', marginBottom: '1.2rem', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)' }}>
                <CameraOff size={40} strokeWidth={1.5} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '0.8rem' }}>Tidak Ada Dokumentasi</span>
              </div>
            )}
            
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', color: 'var(--ink)' }}>{item.nama}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <MapPin size={14} /> {item.lokasi}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <Calendar size={14} /> {item.tanggal}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-mid)', fontWeight: '700', fontSize: '0.8rem' }}>
                    <Clock size={14} /> Status: {item.step === 4 ? 'Selesai' : 'Diproses'}
                </div>
                <div style={{ color: 'var(--accent)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    Detail <ArrowRight size={14} />
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAIL */}
      {selectedBarang && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedBarang(null); }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '650px', borderRadius: '28px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>

            {/* Tombol tutup */}
            <button onClick={() => setSelectedBarang(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f8fafc', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            >
                <X size={20} />
            </button>

            {/* Konten Modal */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 240px' }}>
                    {selectedBarang.foto ? (
                    <img src={selectedBarang.foto} alt={selectedBarang.nama}
                        style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '20px', border: '1px solid var(--border)' }} />
                    ) : (
                    <div style={{ width: '100%', height: '280px', borderRadius: '20px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', border: '1px dashed var(--accent-light)' }}>
                        <CameraOff size={48} strokeWidth={1} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '1rem' }}>Tanpa Dokumentasi</span>
                    </div>
                    )}
                </div>
                
                <div style={{ flex: '1 1 300px' }}>
                    <span className={`badge badge-${selectedBarang.status}`} style={{ marginBottom: '1rem' }}>
                        {selectedBarang.status === 'found' ? 'Barang Temuan' : 'Barang Hilang'}
                    </span>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', color: 'var(--black)' }}>{selectedBarang.nama}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                            <MapPin size={16} color="var(--accent)" /> <strong>Lokasi:</strong> {selectedBarang.lokasi}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                            <Calendar size={16} color="var(--accent)" /> <strong>Tanggal:</strong> {selectedBarang.tanggal}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                            <Clock size={16} color="var(--accent)" /> <strong>Petugas:</strong> {selectedBarang.petugas}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', marginTop: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--accent)" /> Deskripsi & Ciri-Ciri:
                </h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                    {selectedBarang.deskripsi}
                </p>
            </div>

            {/* STEPPER MODERN */}
            <div style={{ marginBottom: '3rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Alur Verifikasi</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '4px', background: '#e2e8f0', zIndex: 1, borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', top: '18px', left: '10%', width: `${((selectedBarang.step - 1) / 3) * 80}%`, height: '4px', background: 'var(--accent)', zIndex: 2, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '2px' }} />
                    {['Laporan', 'Validasi', 'Loket', 'Selesai'].map((label, idx) => {
                        const stepNum = idx + 1;
                        const isDone = stepNum <= selectedBarang.step;
                        const isCurrent = stepNum === selectedBarang.step;
                        return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '20%' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '12px', 
                                background: isDone ? 'var(--accent)' : '#fff', 
                                border: '2px solid',
                                borderColor: isDone ? 'var(--accent)' : '#cbd5e1', 
                                color: isDone ? '#fff' : '#94a3b8', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                fontWeight: 'bold', 
                                fontSize: '0.9rem', 
                                transition: 'all 0.3s',
                                transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: isCurrent ? '0 0 20px rgba(14, 165, 233, 0.3)' : 'none'
                            }}>
                            {isDone ? <CheckCircle size={20} /> : stepNum}
                            </div>
                            <span style={{ fontSize: '0.75rem', marginTop: '0.8rem', textAlign: 'center', fontWeight: isDone ? '700' : '500', color: isDone ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* ===== FITUR KLAIM ===== */}
            {selectedBarang.status === 'found' && (
              <div style={{ borderTop: '2px dashed var(--border)', paddingTop: '2.5rem' }}>
                {claimSuccess ? (
                  <div style={{ background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ background: '#10b981', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#fff' }}>
                        <CheckCircle size={32} />
                    </div>
                    <h4 style={{ color: '#065f46', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pengajuan Klaim Terkirim</h4>
                    <p style={{ fontSize: '0.9rem', color: '#047857', margin: 0 }}>
                      Tim LostLynk akan segera memverifikasi bukti yang kamu berikan. Mohon tunggu informasi selanjutnya.
                    </p>
                  </div>
                ) : !showClaimForm ? (
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--ink)' }}>Apakah ini barang milikmu?</h4>
                    <button
                      onClick={() => setShowClaimForm(true)}
                      style={{ padding: '0.9rem 2.5rem', borderRadius: '14px', border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '0.7rem', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 20px -3px rgba(14, 165, 233, 0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(14, 165, 233, 0.3)'; }}>
                      🙋 Ajukan Klaim Sekarang
                    </button>
                  </div>
                ) : (
                  <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Send size={20} color="var(--accent)" /> Form Pengajuan Klaim
                    </h4>
                    <textarea
                      rows={4}
                      placeholder="Jelaskan bukti kepemilikan Anda secara detail (contoh: nomor seri, ciri fisik khusus, isi di dalam barang, dll)..."
                      value={claimDeskripsi}
                      onChange={e => setClaimDeskripsi(e.target.value)}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1.5px solid var(--border)', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '1.2rem', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => setShowClaimForm(false)}
                        style={{ flex: 1, padding: '0.9rem', borderRadius: '14px', border: '1.5px solid var(--border)', background: '#fff', color: 'var(--muted)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
                        Batal
                      </button>
                      <button onClick={handleSubmitClaim} disabled={isSubmittingClaim}
                        style={{ flex: 2, padding: '0.9rem', borderRadius: '14px', border: 'none', background: isSubmittingClaim ? '#94a3b8' : 'var(--accent)', color: '#fff', fontWeight: '700', cursor: isSubmittingClaim ? 'not-allowed' : 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {isSubmittingClaim ? '⏳ Memproses...' : 'Kirim Pengajuan'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CariBarang;
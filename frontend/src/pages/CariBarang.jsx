import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
    setToastMessage(`Sukses memuat rincian data untuk: ${item.nama}`);
    setSelectedBarang(item);
    setTimeout(() => setToastMessage(''), 3000);
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

      {/* TOAST */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: 'var(--accent-mid, #0ea5e9)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '10px', boxShadow: '0 10px 25px rgba(14,165,233,0.25)', zIndex: 1100, fontWeight: '500', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔔</span> {toastMessage}
        </div>
      )}

      <h2>Galeri Temuan &amp; Kehilangan</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Sistem pelacakan logistik barang hilang berbasis area Universitas Diponegoro.
      </p>

      {/* ERROR BANNER */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={fetchItems} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }}>Coba Lagi</button>
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <input className="form-input" type="text"
          placeholder="🔍 Cari nama barang atau lokasi (contoh: KTM, Lab Tekkom, Arduino...)"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', transition: 'all 0.3s' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(14,165,233,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'found', 'lost'].map(type => (
            <button key={type} onClick={() => setStatusFilter(type)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', background: statusFilter === type ? 'var(--accent)' : '#fff', color: statusFilter === type ? '#fff' : 'var(--muted)' }}>
              {type === 'all' ? '✨ Semua' : type === 'found' ? '📦 Ditemukan' : '🔍 Kehilangan'}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--muted)', alignSelf: 'center' }}>
            {filteredData.length} barang
          </span>
        </div>
      </div>

      {/* GRID KARTU */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {isLoading ? (
          [1,2,3,4,5,6].map(n => (
            <div key={n} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem', height: '160px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div className="shimmer" style={{ width: '60px', height: '20px', background: '#f1f5f9', borderRadius: '4px' }} />
              <div className="shimmer" style={{ width: '80%', height: '24px', background: '#e2e8f0', borderRadius: '4px' }} />
              <div className="shimmer" style={{ width: '50%', height: '16px', background: '#f1f5f9', borderRadius: '4px' }} />
            </div>
          ))
        ) : filteredData.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--muted)', background: '#fff', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            {items.length === 0 ? '📭 Belum ada laporan barang masuk.' : `❌ Tidak ada barang cocok dengan "${search}"`}
          </div>
        ) : filteredData.map(item => (
          <div key={item.id}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem', transition: 'all 0.2s ease', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            onClick={() => handleAksiDetail(item)}>
            {/* Hanya tampilkan foto JIKA ada foto asli yang diupload user */}
            {item.foto ? (
              <img src={item.foto} alt={item.nama}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem', border: '1px solid var(--border)' }} />
            ) : (
              <div style={{ width: '100%', height: '150px', borderRadius: '8px', marginBottom: '0.8rem', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>📷</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Tidak Ada Foto</span>
              </div>
            )}
            <span className={`badge badge-${item.status}`}>
              {item.status === 'found' ? 'Ditemukan' : 'Kehilangan'}
            </span>
            <h4 style={{ margin: '0.6rem 0 0.3rem 0' }}>{item.nama}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>📍 {item.lokasi}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
              <span style={{ color: 'var(--muted)' }}>{item.tanggal}</span>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>Detail &amp; Alur</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAIL */}
      {selectedBarang && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15,23,42,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedBarang(null); }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '20px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Tombol tutup */}
            <button onClick={() => setSelectedBarang(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>

            {/* Foto */}
            {selectedBarang.foto ? (
              <img src={selectedBarang.foto} alt={selectedBarang.nama}
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.2rem', border: '1px solid var(--border)' }} />
            ) : (
              <div style={{ width: '100%', height: '160px', borderRadius: '12px', marginBottom: '1.2rem', background: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>📷</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Tidak Ada Foto Dilampirkan</span>
              </div>
            )}

            <span className={`badge badge-${selectedBarang.status}`} style={{ marginBottom: '1rem' }}>
              {selectedBarang.status === 'found' ? 'Ditemukan' : 'Kehilangan'}
            </span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{selectedBarang.nama}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              📍 {selectedBarang.lokasi} | 📅 {selectedBarang.tanggal}
            </p>

            {/* Deskripsi */}
            <div style={{ background: 'var(--cream)', padding: '1.2rem', borderRadius: '12px', marginBottom: '1.8rem', fontSize: '0.9rem', borderLeft: '4px solid var(--accent)', lineHeight: '1.5' }}>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--ink)' }}>🔍 Ciri-Ciri Spesifik:</strong>
              {selectedBarang.deskripsi}
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.8rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                📌 <strong>Loket / Kontak:</strong> {selectedBarang.petugas}
              </div>
            </div>

            {/* STEPPER */}
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>📌 Alur Verifikasi Logistik Barang:</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 0.5rem', marginBottom: '2rem' }}>
              <div style={{ position: 'absolute', top: '15px', left: '20px', right: '20px', height: '3px', background: '#e2e8f0', zIndex: 1 }} />
              <div style={{ position: 'absolute', top: '15px', left: '20px', width: `${((selectedBarang.step - 1) / 3) * 91}%`, height: '3px', background: 'var(--accent)', zIndex: 2, transition: 'width 0.4s ease' }} />
              {['Dilaporkan', 'Diverifikasi', 'Di Loket', 'Selesai'].map((label, idx) => {
                const stepNum = idx + 1;
                const isDone = stepNum <= selectedBarang.step;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, width: '75px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isDone ? 'var(--accent)' : '#fff', border: isDone ? '2px solid var(--accent)' : '2px solid #cbd5e1', color: isDone ? '#fff' : '#94a3b8', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.3s' }}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center', fontWeight: isDone ? '600' : '400', color: isDone ? 'var(--ink)' : 'var(--muted)' }}>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* ===== FITUR KLAIM ===== */}
            {selectedBarang.status === 'found' && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                {claimSuccess ? (
                  <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h4 style={{ color: '#065f46', margin: '0 0 0.3rem 0' }}>Klaim Berhasil Diajukan!</h4>
                    <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0 }}>
                      Admin akan memverifikasi klaim kamu. Pantau statusnya di <strong>Laporan Saya → Klaim Saya</strong>.
                    </p>
                  </div>
                ) : !showClaimForm ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                      Apakah ini barang milikmu yang hilang?
                    </p>
                    <button
                      onClick={() => setShowClaimForm(true)}
                      style={{ padding: '0.7rem 1.5rem', borderRadius: '10px', border: '2px solid var(--accent)', background: 'var(--accent)', color: '#fff', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.target.style.opacity = '0.85'}
                      onMouseLeave={e => e.target.style.opacity = '1'}>
                      🙋 Ini Milik Saya! Ajukan Klaim
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.8rem', color: 'var(--ink)' }}>
                      🙋 Form Pengajuan Klaim
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>
                      Jelaskan bukti kepemilikan kamu (ciri khusus, isi, nomor seri, dll). Admin akan memverifikasi klaim ini.
                    </p>
                    <textarea
                      rows={4}
                      placeholder="Contoh: Tas laptop warna hitam merk Eiger, ada gantungan kunci berbentuk kucing di ritsleting kanan, bagian dalam ada bercak tinta biru..."
                      value={claimDeskripsi}
                      onChange={e => setClaimDeskripsi(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '0.8rem' }}
                      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button onClick={() => setShowClaimForm(false)}
                        style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#fff', color: 'var(--muted)', fontWeight: '500', cursor: 'pointer', fontSize: '0.88rem' }}>
                        Batal
                      </button>
                      <button onClick={handleSubmitClaim} disabled={isSubmittingClaim}
                        style={{ flex: 2, padding: '0.65rem', borderRadius: '8px', border: 'none', background: isSubmittingClaim ? '#94a3b8' : 'var(--accent)', color: '#fff', fontWeight: '600', cursor: isSubmittingClaim ? 'not-allowed' : 'pointer', fontSize: '0.88rem' }}>
                        {isSubmittingClaim ? '⏳ Mengajukan...' : '🚀 Kirim Klaim'}
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

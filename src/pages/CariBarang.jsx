import React, { useState } from 'react';

function CariBarang() {
  const [search, setSearch] = useState('');
  
  // Simulasi data dari HTML-mu
  const dummyData = [
    { id: 1, nama: 'Kunci Motor Honda', lokasi: 'Parkiran Dekat Lab Elektro', status: 'found', tanggal: '16 Mei 2026' },
    { id: 2, nama: 'KTM atas nama Ahmad', lokasi: 'Perpustakaan Lantai 2', status: 'found', tanggal: '15 Mei 2026' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2>Galeri Temuan & Kehilangan</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Gunakan fitur pencarian untuk menyaring barang berdasarkan nama atau area.</p>

      <div style={{ marginBottom: '2rem' }}>
        <input 
          className="form-input" 
          type="text" 
          placeholder="🔍 Cari berdasarkan kata kunci (contoh: KTM, Kunci...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {dummyData.filter(item => item.nama.toLowerCase().includes(search.toLowerCase())).map(item => (
          <div key={item.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.2rem' }}>
            <span className={`badge badge-${item.status}`}>{item.status}</span>
            <h4 style={{ margin: '0.6rem 0 0.3rem 0' }}>{item.nama}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>📍 {item.lokasi}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem' }}>
              <span style={{ color: 'var(--muted)' }}>{item.tanggal}</span>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CariBarang;
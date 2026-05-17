import React, { useState } from 'react';

const Lapor = ({ onNavigate }) => {
  const [tab, setTab] = useState('temuan');

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Buat Laporan Baru</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Isi formulir secara lengkap agar memudahkan proses verifikasi pemilik asli.</p>

      <div style={{ display: 'inline-flex', background: 'var(--cream)', padding: '0.3rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <button className="btn" style={{ background: tab === 'temuan' ? '#fff' : 'transparent', color: 'var(--ink)' }} onClick={() => setTab('temuan')}>📦 Saya Menemukan Barang</button>
        <button className="btn" style={{ background: tab === 'hilang' ? '#fff' : 'transparent', color: 'var(--ink)' }} onClick={() => setTab('hilang')}>🔍 Saya Kehilangan Barang</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Nama Barang</label>
            <input className="form-input" type="text" placeholder="Contoh: Dompet Kulit Coklat, KTM" />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Lokasi Kampus</label>
            <select className="form-select">
              <option>UPT Perpustakaan Pusat</option>
              <option>Fakultas Teknik (Teknik Komputer)</option>
              <option>Gedung Widya Puraya</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Deskripsi / Ciri-Ciri</label>
            <textarea className="form-textarea" rows="4" placeholder="Sebutkan ciri spesifik barang..."></textarea>
          </div>
          <button className="btn btn-accent" style={{ marginTop: '1rem', width: '100%' }} onClick={() => onNavigate('laporan-saya')}>Kirim Laporan Resmi</button>
        </div>

        <div style={{ border: '2px dashed var(--accent)', background: 'var(--cream)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '260px' }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</span>
          <p style={{ fontWeight: '500', color: 'var(--accent-mid)' }}>Unggah Gambar Barang</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>PNG atau JPG (Maks. 5MB)</span>
        </div>
      </div>
    </div>
  );
};

export default Lapor;
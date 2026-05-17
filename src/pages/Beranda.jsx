import React from 'react';

const Beranda = ({ onNavigate }) => {
  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <span style={{ background: 'var(--accent-light)', color: 'var(--accent-mid)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>PORTAL RESMI UNDIP</span>
          <h1 style={{ fontSize: '2.4rem', margin: '1rem 0', lineHeight: '1.2' }}>Temukan Kembali Barang Hilangmu di <span style={{ color: 'var(--accent)' }}>Kampus.</span></h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Laporkan penemuan barang tercepat atau cari barang berhargamu yang hilang di seluruh area Universitas Diponegoro.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-accent" onClick={() => onNavigate('lapor')}>Lapor Penemuan</button>
            <button className="btn btn-secondary" onClick={() => onNavigate('cari')}>Cari di Galeri</button>
          </div>
        </div>
        <div style={{ background: 'var(--cream)', borderRadius: '24px', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--accent-light)' }}>
          <span style={{ color: 'var(--accent-mid)', fontWeight: 'bold' }}>[ Ilustrasi Visual Biru Muda LostLynk ]</span>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
import React, { useState } from 'react';

const CariBarang = () => {
  const [katalog] = useState([
    { id: 'QUE-17', nama: 'Modul Arduino Uno R3 + Kabel USB', lokasi: 'Lab Sistem Tertanam & Robotika Tekkom', status: 'lost', tanggal: '18 Mei 2026' },
    { id: 'QUE-18', nama: 'Mouse Logitech Wireless Hitam', lokasi: 'Lab Jaringan & Keamanan Komputer Tekkom', status: 'lost', tanggal: '17 Mei 2026' },
    { id: 'QUE-19', nama: 'Modul ESP32 NodeMCU Wi-Fi', lokasi: 'Selasar Lantai 1 Gedung Teknik Komputer', status: 'found', tanggal: '14 Mei 2026' },
    { id: 'QUE-20', nama: 'Kabel VGA ke HDMI Warna Hitam', lokasi: 'Ruang Kuliah E.102 Ruang Teori', status: 'found', tanggal: '18 Mei 2026', step: 1, pelapor: 'Dosen RPL', isDeleted: false },
    { id: 'QUE-21', nama: 'Charger Laptop ASUS ROG 150W', lokasi: 'Lab Pemrograman & Rekayasa Perangkat Lunak', status: 'lost', tanggal: '16 Mei 2026', step: 2, pelapor: 'Faris Revansyah', isDeleted: false },

    // KELOMPOK 2: BARANG PRIBADI & AKSESORIS (SERING TERCECER)
    { id: 'QUE-22', nama: 'Kacamata Minus Frame Kotak Hitam', lokasi: 'Toilet Lantai 2 Gedung Tekkom', status: 'lost', tanggal: '15 Mei 2026', step: 1, pelapor: 'Anindya Putri', isDeleted: false },
    { id: 'QUE-23', nama: 'Tumbler Corkcicle Warna Pink Pastel', lokasi: 'Ruang Kuliah E.201 Kelas Utama', status: 'lost', tanggal: '18 Mei 2026', step: 2, pelapor: 'Siti Aminah', isDeleted: false },
    { id: 'QUE-24', nama: 'Flashdisk Sandisk Ultra 32GB Merah', lokasi: 'Meja Komputer Lab Jaringan', status: 'found', tanggal: '13 Mei 2026', step: 4, pelapor: 'Asisten Lab', isDeleted: false },
    { id: 'QUE-25', nama: 'Pouch Kosmetik Motif Hello Kitty', lokasi: 'Selasar Lantai 3 Gedung Tekkom', status: 'lost', tanggal: '17 Mei 2026', step: 1, pelapor: 'Dian Lestari', isDeleted: false },
    { id: 'QUE-26', nama: 'Dompet Kulit Coklat (Ada KTM Undip)', lokasi: 'Kantin Belakang Gedung Teknik Komputer', status: 'found', tanggal: '12 Mei 2026', step: 3, pelapor: 'Pak Satpam', isDeleted: false },

    // KELOMPOK 3: ATK & PERLENGKAPAN KULIAH
    { id: 'QUE-27', nama: 'Binder Catatan Kuliah A5 Cream Girly', lokasi: 'Ruang Kuliah E.101', status: 'lost', tanggal: '18 Mei 2026', step: 1, pelapor: 'Amanda Rezky', isDeleted: false },
    { id: 'QUE-28', nama: 'Powerbank Baseus 20.000 mAh Hitam', lokasi: 'Lab Arsitektur & Digital Komputer', status: 'found', tanggal: '15 Mei 2026', step: 2, pelapor: 'Budi Raharjo', isDeleted: false },
    { id: 'QUE-29', nama: 'Headphone JBL Tune 510BT Biru', lokasi: 'Selasar Tangga Darurat Lantai 2', status: 'lost', tanggal: '11 Mei 2026', step: 3, pelapor: 'Gilang Permana', isDeleted: false },

    // KELOMPOK 4: DATA YANG SUDAH DI-SOFT DELETE (MASUK KERANJANG SAMPAH ADMIN)
    { id: 'QUE-30', nama: 'Uang Tunai Rp 50.000 (Laporan Duplikat)', lokasi: 'Depan Ruang Dosen', status: 'found', tanggal: '10 Mei 2026', step: 1, pelapor: 'Seseorang', isDeleted: true },
    { id: 'QUE-31', nama: 'Kunci Motor Honda Vario (Sudah Diambil Luar Sistem)', lokasi: 'Parkiran Motor Utama Tekkom', status: 'lost', tanggal: '09 Mei 2026', step: 4, pelapor: 'Rian Hidayat', isDeleted: true }
  ]);


  const [searchQuery, setSearchQuery] = useState('');

  const filteredKatalog = katalog.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', paddingTop: '2rem' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .katalog-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .katalog-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 30px rgba(14, 165, 233, 0.1);
          border-color: var(--accent-light);
        }
      `}</style>

      <h2>🔍 Sistem Navigasi Katalog Barang</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Gunakan indeks kata kunci global untuk memetakan kepemilikan inventaris tercecer.</p>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Cari instan berdasarkan tipe barang atau lokasi spesifik..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredKatalog.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic', gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            ❌ Tidak ada log barang yang cocok dengan kata kunci tersebut.
          </p>
        ) : (
          filteredKatalog.map(item => (
            <div key={item.id} className="katalog-card">
              <span style={{
                position: 'absolute', top: '1.2rem', right: '1.2rem', padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold',
                background: item.status === 'lost' ? '#fee2e2' : '#d1fae5',
                color: item.status === 'lost' ? '#ef4444' : '#065f46',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                {item.status === 'lost' ? '⚠️ HILANG' : '📦 TEMUAN'}
              </span>

              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-mid)', fontWeight: 'bold', marginBottom: '0.6rem' }}>
                {item.id}
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.2rem', color: 'var(--ink)' }}>
                {item.nama}
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📍 <span style={{ color: 'var(--ink)' }}>{item.lokasi}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📅 <span>{item.tanggal}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CariBarang;
import React, { useState } from 'react';

const Lapor = ({ onNavigate }) => {
  const [tab, setTab] = useState('temuan');
  const [namaBarang, setNamaBarang] = useState('');
  const [lokasi, setLokasi] = useState('Lab Sistem Tertanam & Robotika Tekkom');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Simulasi penanganan upload gambar untuk memunculkan preview langsung
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Simulasi pengiriman data formulir dengan efek loading button
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaBarang || !deskripsi) {
      alert('Harap isi nama barang dan deskripsi terlebih dahulu ya!');
      return;

    }

    setIsSubmitting(true);

    // Ceritanya data dikirim ke database selama 1.5 detik
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('laporan-saya'); // Langsung pindah ke daftar laporan saya
    }, 1500);
  };



  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Buat Laporan Baru</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Isi formulir secara lengkap agar memudahkan proses verifikasi tim LostLynk Teknik Komputer.</p>

      {/* Switch Tab Kategori Laporan */}
      <div style={{ display: 'inline-flex', background: 'var(--cream)', padding: '0.3rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <button
          className="btn"
          style={{ background: tab === 'temuan' ? '#fff' : 'transparent', color: 'var(--ink)', fontWeight: tab === 'temuan' ? '600' : '400', transition: 'all 0.2s' }}
          onClick={() => setTab('temuan')}
        >
          📦 Saya Menemukan Barang
        </button>
        <button
          className="btn"
          style={{ background: tab === 'hilang' ? '#fff' : 'transparent', color: 'var(--ink)', fontWeight: tab === 'hilang' ? '600' : '400', transition: 'all 0.2s' }}
          onClick={() => setTab('hilang')}
        >
          🔍 Saya Kehilangan Barang
        </button>
      </div>

      {/* Grid Utama Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

        {/* PANEL KIRI: FORMULIR INPUT */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Nama Barang</label>
            <input
              className="form-input"
              type="text"
              placeholder="Contoh: Modul ESP32, TWS Baseus, KTM"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Lokasi Spesifik</label>
            <select
              className="form-select"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              <option>Lab Sistem Tertanam & Robotika Tekkom</option>
              <option>Lab Jaringan & Keamanan Komputer Tekkom</option>
              <option>Ruang Kuliah 202 Gedung Tekkom FT</option>
              <option>Ruang Himpunan Mahasiswa (HM) Tekkom</option>
              <option>Perpustakaan Pusat (UPT) Undip</option>
              <option>Gedung Widya Puraya</option>
            </select>
          </div>

          <div className="form-group" style={{ marginTop: '1.2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Deskripsi Ciri-Ciri Spesifik</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Sebutkan ciri unik (warna case, stiker, isi folder jika flashdisk)..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            ></textarea>
          </div>

          {/* Tombol Submit dengan Status Loading */}
          <button
            className="btn btn-accent"
            style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Memproses Laporan Resmi...
              </>
            ) : (
              '🚀 Kirim Laporan Ke Sistem'
            )}
          </button>
        </div>

        {/* PANEL KANAN: LIVE PREVIEW KARTU BARANG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Box Unggah Gambar Interaktif */}
          <label style={{ border: '2px dashed var(--accent)', background: 'var(--cream)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
            ) : (
              <>
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</span>
                <p style={{ fontWeight: '500', color: 'var(--accent-mid)', margin: 0 }}>Unggah Foto Barang</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Klik untuk simulasi upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>

          {/* Live Preview Display Card */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>👀 LIVE PREVIEW LAPORAN</span>
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.8rem' }}>
              <span className={`badge badge-${tab === 'temuan' ? 'found' : 'lost'}`}>
                {tab === 'temuan' ? 'Ditemukan' : 'Kehilangan'}
              </span>
              <h4 style={{ margin: '0.6rem 0 0.3rem 0', color: namaBarang ? 'var(--ink)' : '#94a3b8' }}>
                {namaBarang || 'Nama Barang Kamu...'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.8rem 0' }}>📍 {lokasi}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', minHeight: '50px', margin: 0, fontStyle: deskripsi ? 'normal' : 'italic' }}>
                {deskripsi || 'Ciri spesifik barang yang kamu ketik di formulir akan langsung muncul live di sini...'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Lapor;
import React, { useState } from 'react';

const Lapor = ({ onNavigate }) => {
  const [namaBarang, setNamaBarang] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState('lost');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler Upload File Gambar & Bikin Preview Instan
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaBarang || !lokasi) {
      alert('Harap isi nama barang dan lokasi terlebih dahulu ya!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('laporan-saya');
    }, 1800);
  };

  return (
    <div style={{
      animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      paddingTop: '2.5rem',
      maxWidth: '650px',
      margin: '0 auto'
    }}>
      {/* CSS Animasi disisipkan langsung ke DOM */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-card {
          background: #ffffff;
          border: 1px solid var(--border);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(14, 165, 233, 0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .form-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08);
        }
        .upload-zone {
          border: 2px dashed #cbd5e1;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          transition: all 0.2s ease;
        }
        .upload-zone:hover {
          border-color: var(--accent);
          background: #f0f9ff;
        }
        .animated-btn {
          width: 100%;
          margin-top: 2rem;
          padding: 0.95rem;
          border-radius: 14px;
          border: none;
          background: var(--accent);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
        }
        .animated-btn:hover:not(:disabled) {
          background: var(--accent-mid);
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
        }
        .animated-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
      `}</style>

      <h2 style={{ textAlign: 'center', fontWeight: '800', marginBottom: '0.5rem' }}>📢 Hub Logistik Formulir</h2>
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Pencatatan multimedia terintegrasi untuk akurasi pelacakan barang fisik.</p>

      <form onSubmit={handleSubmit} className="form-card">

        <div className="form-group">
          <label className="form-label">Otoritas Status</label>
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="lost">⚠️ Kehilangan Barang (Mencari)</option>
            <option value="found">📦 Menemukan Barang (Melaporkan)</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '1.2rem' }}>
          <label className="form-label">Nama Identifikasi Barang</label>
          <input className="form-input" type="text" placeholder="Contoh: Flashdisk Sandisk Cruzer 64GB" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} disabled={isSubmitting} />
        </div>

        <div className="form-group" style={{ marginTop: '1.2rem' }}>
          <label className="form-label">Titik Lokasi Terakhir</label>
          <input className="form-input" type="text" placeholder="Contoh: Meja Lab Sistem Tertanam & Robotika" value={lokasi} onChange={(e) => setLokasi(e.target.value)} disabled={isSubmitting} />
        </div>

        {/* BARU: SLOT MULTIMEDIA UPLOAD FOTO BARANG */}
        <div className="form-group" style={{ marginTop: '1.2rem' }}>
          <label className="form-label">Bukti Foto Fisik Barang (Opsional)</label>
          <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={isSubmitting} />

          <label htmlFor="file-upload">
            <div className="upload-zone">
              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.5rem', fontWeight: 'bold' }}>🔄 Klik gambar untuk mengganti</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📸</div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--ink)' }}>Seret file atau klik di sini untuk unggah gambar</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem' }}>Format PNG, JPG maks 5MB</div>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="form-group" style={{ marginTop: '1.2rem' }}>
          <label className="form-label">Deskripsi & Karakteristik Spesifik</label>
          <textarea className="form-input" rows="3" placeholder="Contoh: Ada gantungan kunci Hello Kitty pink..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} disabled={isSubmitting} style={{ resize: 'none' }} />
        </div>

        <button type="submit" className="animated-btn" disabled={isSubmitting}>
          {isSubmitting ? '⌛ Sinkronisasi Basis Data...' : '🚀 Publikasikan Laporan'}
        </button>

      </form>
    </div>
  );
};

export default Lapor;
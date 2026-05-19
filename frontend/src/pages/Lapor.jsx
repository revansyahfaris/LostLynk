import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Lapor = ({ onNavigate }) => {
  const [tab, setTab] = useState('temuan');
  const [namaBarang, setNamaBarang] = useState('');
  const [lokasi, setLokasi] = useState('Lab Sistem Tertanam & Robotika Tekkom');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFotoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaBarang || !deskripsi) {
      alert('Harap isi nama barang dan deskripsi!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ambil user yang sedang login
      const { data: { user } } = await supabase.auth.getUser();

      let fotoUrl = null;

      // Upload foto jika ada
      if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(fileName, fotoFile);

        if (uploadError) {
          throw new Error('Gagal mengunggah foto ke Storage: ' + uploadError.message + '\n\nPastikan Anda telah membuat bucket "item-photos" di Supabase Dashboard dan mengeset statusnya sebagai Public.');
        }

        const { data: urlData } = supabase.storage
          .from('item-photos')
          .getPublicUrl(fileName);
        fotoUrl = urlData.publicUrl;
      }

      // Simpan ke tabel yang sesuai
      if (tab === 'temuan') {
        const { error } = await supabase.from('found_item').insert({
          user_id: user.id,
          nama_barang: namaBarang,
          deskripsi: deskripsi,
          lokasi_ditemukan: lokasi,
          tanggal_ditemukan: new Date().toISOString().split('T')[0],
          foto: fotoUrl,
          status: 'pending'
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lost_item').insert({
          user_id: user.id,
          nama_barang: namaBarang,
          deskripsi: deskripsi,
          lokasi_hilang: lokasi,
          tanggal_hilang: new Date().toISOString().split('T')[0],
          foto: fotoUrl,
          status: 'pending'
        });
        if (error) throw error;
      }

      alert('Laporan berhasil dikirim!');
      onNavigate('laporan-saya');

    } catch (err) {
      alert('Gagal mengirim laporan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Buat Laporan Baru</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Isi formulir secara lengkap agar memudahkan proses verifikasi tim LostLynk.</p>

      {/* Tab */}
      <div style={{ display: 'inline-flex', background: 'var(--cream)', padding: '0.3rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <button className="btn"
          style={{ background: tab === 'temuan' ? '#fff' : 'transparent', color: 'var(--ink)', fontWeight: tab === 'temuan' ? '600' : '400' }}
          onClick={() => setTab('temuan')}>
          📦 Saya Menemukan Barang
        </button>
        <button className="btn"
          style={{ background: tab === 'hilang' ? '#fff' : 'transparent', color: 'var(--ink)', fontWeight: tab === 'hilang' ? '600' : '400' }}
          onClick={() => setTab('hilang')}>
          🔍 Saya Kehilangan Barang
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>

        {/* Panel Kiri */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Nama Barang</label>
            <input className="form-input" type="text"
              placeholder="Contoh: Modul ESP32, TWS Baseus, KTM"
              value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginTop: '1.2rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Lokasi Spesifik</label>
            <select className="form-select" value={lokasi} onChange={(e) => setLokasi(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
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
            <textarea className="form-textarea" rows="4"
              placeholder="Sebutkan ciri unik (warna case, stiker, isi folder jika flashdisk)..."
              value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}></textarea>
          </div>

          <button className="btn btn-accent"
            style={{ marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '⏳ Mengirim...' : '🚀 Kirim Laporan Ke Sistem'}
          </button>
        </div>

        {/* Panel Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <label style={{ border: '2px dashed var(--accent)', background: 'var(--cream)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
            ) : (
              <>
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</span>
                <p style={{ fontWeight: '500', color: 'var(--accent-mid)', margin: 0 }}>Unggah Foto Barang</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Klik untuk upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>👀 LIVE PREVIEW LAPORAN</span>
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.8rem' }}>
              <span className={`badge badge-${tab === 'temuan' ? 'found' : 'lost'}`}>
                {tab === 'temuan' ? 'Ditemukan' : 'Kehilangan'}
              </span>
              <h4 style={{ margin: '0.6rem 0 0.3rem 0', color: namaBarang ? 'var(--ink)' : '#94a3b8' }}>
                {namaBarang || 'Nama Barang Kamu...'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.8rem 0' }}>📍 {lokasi}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', background: '#f8fafc', padding: '0.6rem', borderRadius: '6px', minHeight: '50px', margin: 0, fontStyle: deskripsi ? 'normal' : 'italic' }}>
                {deskripsi || 'Deskripsi barang akan muncul di sini...'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lapor;
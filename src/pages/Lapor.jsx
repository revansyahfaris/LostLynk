import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Package, Search, Image as ImageIcon, Send, MapPin, Info, ClipboardList } from 'lucide-react';

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

    // Foto wajib untuk SEMUA laporan sesuai revisi
    if (!fotoFile) {
      alert('Foto barang wajib diunggah untuk keperluan verifikasi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let fotoUrl = null;

      if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(fileName, fotoFile);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('item-photos')
            .getPublicUrl(fileName);
          fotoUrl = urlData.publicUrl;
        } else {
            throw uploadError;
        }
      }

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
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Buat Laporan Baru</h2>
        <p style={{ color: 'var(--muted)', margin: 0 }}>Lengkapi detail informasi untuk mempercepat proses verifikasi logistik.</p>
      </div>

      {/* Tab Switcher Modern */}
      <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '0.4rem', borderRadius: '14px', marginBottom: '2.5rem', gap: '0.4rem' }}>
        <button 
          className="btn"
          style={{ 
            background: tab === 'temuan' ? '#fff' : 'transparent', 
            color: 'var(--ink)', 
            fontWeight: '700',
            fontSize: '0.85rem',
            padding: '0.7rem 1.5rem',
            borderRadius: '10px',
            boxShadow: tab === 'temuan' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
          onClick={() => setTab('temuan')}>
          <Package size={18} color={tab === 'temuan' ? 'var(--accent)' : 'var(--muted)'} /> Saya Menemukan Barang
        </button>
        <button 
          className="btn"
          style={{ 
            background: tab === 'hilang' ? '#fff' : 'transparent', 
            color: 'var(--ink)', 
            fontWeight: '700',
            fontSize: '0.85rem',
            padding: '0.7rem 1.5rem',
            borderRadius: '10px',
            boxShadow: tab === 'hilang' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
          onClick={() => setTab('hilang')}>
          <Search size={18} color={tab === 'hilang' ? 'var(--accent)' : 'var(--muted)'} /> Saya Kehilangan Barang
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>

        {/* Panel Kiri: Form */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', flex: '1 1 550px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Package size={16} color="var(--accent)" /> Nama Barang
            </label>
            <input className="form-input" type="text"
              placeholder="Contoh: TWS Baseus, Modul ESP32, KTM"
              value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} 
              style={{ padding: '0.8rem 1rem', borderRadius: '12px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <MapPin size={16} color="var(--accent)" /> Lokasi Spesifik
            </label>
            <select className="form-select" value={lokasi} onChange={(e) => setLokasi(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', cursor: 'pointer' }}>
              <option>Lab Sistem Tertanam & Robotika Tekkom</option>
              <option>Lab Jaringan & Keamanan Komputer Tekkom</option>
              <option>Ruang Kuliah 202 Gedung Tekkom FT</option>
              <option>Ruang Himpunan Mahasiswa (HM) Tekkom</option>
              <option>Perpustakaan Pusat (UPT) Undip</option>
              <option>Gedung Widya Puraya</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Info size={16} color="var(--accent)" /> Deskripsi Ciri Unik
            </label>
            <textarea className="form-textarea" rows="4"
              placeholder="Sebutkan ciri unik (warna case, stiker, isi folder jika flashdisk)..."
              value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              style={{ padding: '0.8rem 1rem', borderRadius: '12px' }}
            ></textarea>
          </div>

          <button className="btn btn-accent"
            style={{ width: '100%', padding: '1rem', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', fontWeight: '700', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)' }}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '⏳ Memproses...' : <><Send size={20} /> Kirim Laporan</>}
          </button>
        </div>

        {/* Panel Kanan: Upload & Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: '1 1 350px' }}>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ImageIcon size={16} color="var(--accent)" /> Dokumentasi Foto
            </label>
            <label style={{
                border: !fotoFile ? '2px dashed #cbd5e1' : '2px solid var(--accent)',
                background: !fotoFile ? '#f8fafc' : 'var(--cream)',
                borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', height: '240px',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}>
                {previewImage ? (
                <img src={previewImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                ) : (
                <>
                    <div style={{ background: '#fff', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <ImageIcon size={28} color="var(--muted)" />
                    </div>
                    <p style={{ fontWeight: '700', color: 'var(--ink)', marginBottom: '0.3rem' }}>
                    Unggah Foto Barang <span style={{ color: '#ef4444' }}>*</span>
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Format: JPG, PNG, WEBP</span>
                </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
            {!fotoFile && (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.8rem', fontWeight: '600', textAlign: 'center' }}>
                    * Foto wajib diunggah untuk keperluan verifikasi.
                </p>
            )}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.8rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <ClipboardList size={18} color="var(--muted)" />
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ringkasan Laporan</span>
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
              <span className={`badge badge-${tab === 'temuan' ? 'found' : 'lost'}`} style={{ marginBottom: '0.8rem' }}>
                {tab === 'temuan' ? 'Ditemukan' : 'Kehilangan'}
              </span>
              <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: namaBarang ? 'var(--ink)' : '#cbd5e1' }}>
                {namaBarang || 'Judul Laporan Anda'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} /> {lokasi}
              </p>
              <div style={{ fontSize: '0.85rem', color: deskripsi ? 'var(--ink)' : '#cbd5e1', background: '#f8fafc', padding: '1rem', borderRadius: '12px', minHeight: '80px', lineHeight: '1.6' }}>
                {deskripsi || 'Detail deskripsi akan muncul di sini...'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lapor;
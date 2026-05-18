import React, { useState } from 'react';

const LaporanSaya = () => {
  const [activeTab, setActiveTab] = useState('aktif');

  // Dummy data laporan yang dibuat oleh user Sharon (Teknik Komputer)
  const myReports = [
    { id: 'QUE-17', nama: 'Modul Arduino Uno R3 + Kabel USB', lokasi: 'Lab Sistem Tertanam & Robotika Tekkom', status: 'lost', tanggal: '18 Mei 2026', logistik: 'Dilaporkan', deskripsi: 'Ketinggalan di meja praktikum shift 2.', kategori: 'aktif' },
    { id: 'QUE-18', nama: 'Mouse Logitech Wireless Hitam', lokasi: 'Lab Jaringan & Keamanan Komputer Tekkom', status: 'lost', tanggal: '17 Mei 2026', logistik: 'Diverifikasi', deskripsi: 'Mouse seri B170 tanpa USB receiver.', kategori: 'aktif' },
    { id: 'QUE-12', nama: 'Minitripod & Modul Kamera ESP32-CAM', lokasi: 'Lab Jaringan & Sistem Digital Tekkom', status: 'found', tanggal: '11 Mei 2026', logistik: 'Selesai', deskripsi: 'Sudah diambil kembali dan diverifikasi oleh asisten lab.', kategori: 'selesai', tglSelesai: '14 Mei 2026' }
  ];

  // Fungsi simulasi cetak Berita Acara (BA) serah terima barang
  const handleCetakPDF = (report) => {
    alert(`📄 Mendownload Berita Acara Resmi LostLynk Undip...\n\nID Dokumen: BA-${report.id}\nBarang: ${report.nama}\nStatus: Telah Sukses Dikembalikan ke Pemilik Sah.\n\nFile PDF sukses disimpan di folder Downloads!`);
  };

  const filteredReports = myReports.filter(report => report.kategori === activeTab);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2>Riwayat Laporan Saya</h2>
        <span style={{ background: 'var(--cream)', color: 'var(--accent-mid)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid var(--accent-light)' }}>
          USER: Sharon Tabitha
        </span>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Pantau status verifikasi logistik barang milikmu atau cetak bukti serah terima resmi di sini.</p>

      {/* Tab Filter Status Laporan */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('aktif')}
          style={{
            padding: '0.8rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'aktif' ? '600' : '400',
            color: activeTab === 'aktif' ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === 'aktif' ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s'
          }}
        >
          ⏳ Laporan Aktif ({myReports.filter(r => r.kategori === 'aktif').length})
        </button>
        <button
          onClick={() => setActiveTab('selesai')}
          style={{
            padding: '0.8rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: activeTab === 'selesai' ? '600' : '400',
            color: activeTab === 'selesai' ? 'var(--accent)' : 'var(--muted)',
            borderBottom: activeTab === 'selesai' ? '3px solid var(--accent)' : '3px solid transparent',
            marginBottom: '-2px', transition: 'all 0.2s'
          }}
        >
          ✅ Selesai / Arsip ({myReports.filter(r => r.kategori === 'selesai').length})
        </button>
      </div>

      {/* LIST KARTU LAPORAN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredReports.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px dashed var(--border)' }}>
            Tidak ada riwayat laporan di kategori ini.
          </p>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              style={{
                background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem',
                display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '1.5rem',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Kolom Informasi Kiri */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--cream)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', color: 'var(--ink)' }}>
                    {report.id}
                  </span>
                  <span className={`badge badge-${report.status}`}>
                    {report.status === 'found' ? 'Temuan' : 'Kehilangan'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-mid)', fontWeight: '600', background: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    📦 Status: {report.logistik}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.3rem 0' }}>{report.nama}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>📍 {report.lokasi} | 📅 {report.tanggal}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink)', margin: 0, fontStyle: 'italic' }}>"{report.deskripsi}"</p>

                {report.tglSelesai && (
                  <p style={{ fontSize: '0.8rem', color: '#10b981', margin: '0.5rem 0 0 0', fontWeight: '500' }}>
                    🎉 Selesai diserahterimakan pada: {report.tglSelesai}
                  </p>
                )}
              </div>

              {/* Kolom Aksi Kanan */}
              <div>
                {report.kategori === 'selesai' ? (
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#10b981', borderColor: '#10b981' }}
                    onClick={() => handleCetakPDF(report)}
                  >
                    📥 Cetak Bukti BA
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8-rem', fontWeight: '500', padding: '0.5rem 1rem', background: 'var(--cream)', borderRadius: '8px' }}>
                    🔒 Diproses Admin
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LaporanSaya;
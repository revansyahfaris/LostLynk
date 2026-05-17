import React, { useState } from 'react';

function LaporanSaya() {
  const [activeTab, setActiveTab] = useState('all');

  // Simulasi data riwayat laporan milik pengguna
  const [myReports] = useState([
    {
      id: 1,
      title: 'KTM atas nama Ahmad B.',
      type: 'found',
      date: '15 Lapor',
      location: 'Perpustakaan Lantai 2',
      status: 'Proses Klaim',
      statusColor: 'var(--pending)',
      statusBg: 'var(--pending-bg)'
    },
    {
      id: 2,
      title: 'Kunci Motor Honda',
      type: 'found',
      date: '16 Lapor',
      location: 'Parkiran Dekat Lab Elektro',
      status: 'Selesai Dikembalikan',
      statusColor: 'var(--found)',
      statusBg: 'var(--found-bg)'
    }
  ]);

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header Halaman */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Laporan Saya</h2>
        <p style={{ color: 'var(--muted)' }}>Pantau perkembangan verifikasi dan status klaim dari barang-barang yang sudah Anda laporkan.</p>
      </div>

      {/* Konten Utama */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        {myReports.length === 0 ? (
          /* Tampilan jika data kosong */
          <div style={{ textAlignment: 'center', padding: '4rem 0', color: 'var(--muted)', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📭</span>
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Belum ada riwayat laporan aktif dari akun Anda.</p>
          </div>
        ) : (
          /* Daftar List Laporan */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myReports.map((report) => (
              <div 
                key={report.id} 
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid var(--border)', 
                  borderRadius: '14px', 
                  padding: '1.2rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.01)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ fontSize: '1.8rem', background: 'var(--cream)', padding: '0.6rem', borderRadius: '10px' }}>
                    {report.type === 'found' ? '📦' : '🔍'}
                  </div>
                  <div>
                    <span className={`badge badge-${report.type}`} style={{ marginBottom: '0.4rem' }}>
                      {report.type === 'found' ? 'Temuan' : 'Kehilangan'}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.2rem' }}>{report.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      📍 {report.location} • <span style={{ color: 'var(--accent-mid)' }}>{report.date}</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span 
                    style={{ 
                      background: report.statusBg, 
                      color: report.statusColor, 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '8px', 
                      fontSize: '0.82rem', 
                      fontWeight: '600' 
                    }}
                  >
                    • {report.status}
                  </span>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default LaporanSaya;
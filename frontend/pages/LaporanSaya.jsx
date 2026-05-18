import React from 'react';

const LaporanSaya = () => {
  const riwayatSaya = [
    {
      id: 'QUE-17',
      nama: 'Modul Arduino Uno R3 + Kabel USB',
      lokasi: 'Lab Sistem Tertanam & Robotika Tekkom',
      tanggal: '18 Mei 2026',
      stepActive: 2 // Contoh: Berada di Step 2 (Diverifikasi)
    }
  ];

  return (
    <div className="container" style={{
      animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      paddingTop: '2rem',
      maxWidth: '850px'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.5); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        @keyframes lineGrow {
          from { width: 0%; }
          to { width: ${(riwayatSaya[0].stepActive - 1) * 33.33}%; }
        }
        .tracker-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.01);
          transition: all 0.3s ease;
        }
        .tracker-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.06);
        }
        .active-pulse-node {
          animation: pulseGlow 2s infinite;
          background: var(--accent) !important;
          color: #fff !important;
        }
      `}</style>

      <h2>📄 Pelacakan Tiket Logistik</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>Pantau pergerakan fisik barang bukti dan status kepemilikan antrean secara real-time.</p>

      {riwayatSaya.map((item) => (
        <div key={item.id} className="tracker-card">

          {/* Card Meta Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.2rem', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '600' }}>KODE TIKET ANTRIAN</span>
              <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: '800', color: 'var(--ink)' }}>{item.id}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>{item.nama}</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>📍 {item.lokasi} | 📅 {item.tanggal}</span>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: '700' }}>📊 Progres Validasi Fisik:</h4>

          {/* TIMELINE TRACKER PREMIUM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 1rem', marginTop: '2rem' }}>

            {/* Garis Dasar Pasif */}
            <div style={{ position: 'absolute', top: '16px', left: '2rem', right: '2rem', height: '5px', background: '#e2e8f0', borderRadius: '10px', zIndex: 1 }} />

            {/* Garis Aktif Beranimasi Memanjang */}
            <div style={{
              position: 'absolute', top: '16px', left: '2rem', height: '5px',
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-mid) 100%)',
              borderRadius: '10px', zIndex: 2,
              animation: 'lineGrow 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }} />

            {/* Simpul 1 */}
            <div style={{ textAlign: 'center', zIndex: 3, width: '80px' }}>
              <div className={item.stepActive === 1 ? 'active-pulse-node' : ''} style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.stepActive >= 1 ? 'var(--accent)' : '#fff', color: item.stepActive >= 1 ? '#fff' : '#94a3b8', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>1</div>
              <div style={{ fontSize: '0.75rem', fontWeight: item.stepActive === 1 ? '700' : '500', marginTop: '0.6rem', color: item.stepActive >= 1 ? 'var(--ink)' : 'var(--muted)' }}>📝 Dilaporkan</div>
            </div>

            {/* Simpul 2 */}
            <div style={{ textAlign: 'center', zIndex: 3, width: '80px' }}>
              <div className={item.stepActive === 2 ? 'active-pulse-node' : ''} style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.stepActive >= 2 ? 'var(--accent)' : '#fff', color: item.stepActive >= 2 ? '#fff' : '#94a3b8', border: item.stepActive >= 2 ? '2px solid var(--accent)' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>2</div>
              <div style={{ fontSize: '0.75rem', fontWeight: item.stepActive === 2 ? '700' : '500', marginTop: '0.6rem', color: item.stepActive >= 2 ? 'var(--ink)' : 'var(--muted)' }}>🔍 Verified</div>
            </div>

            {/* Simpul 3 */}
            <div style={{ textAlign: 'center', zIndex: 3, width: '80px' }}>
              <div className={item.stepActive === 3 ? 'active-pulse-node' : ''} style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.stepActive >= 3 ? 'var(--accent)' : '#fff', color: item.stepActive >= 3 ? '#fff' : '#94a3b8', border: item.stepActive >= 3 ? '2px solid var(--accent)' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>3</div>
              <div style={{ fontSize: '0.75rem', fontWeight: item.stepActive === 3 ? '700' : '500', marginTop: '0.6rem', color: item.stepActive >= 3 ? 'var(--ink)' : 'var(--muted)' }}>🏢 Di Loket</div>
            </div>

            {/* Simpul 4 */}
            <div style={{ textAlign: 'center', zIndex: 3, width: '80px' }}>
              <div className={item.stepActive === 4 ? 'active-pulse-node' : ''} style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.stepActive >= 4 ? 'var(--accent)' : '#fff', color: item.stepActive >= 4 ? '#fff' : '#94a3b8', border: item.stepActive >= 4 ? '2px solid var(--accent)' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontWeight: 'bold' }}>4</div>
              <div style={{ fontSize: '0.75rem', fontWeight: item.stepActive === 4 ? '700' : '500', marginTop: '0.6rem', color: item.stepActive >= 4 ? 'var(--ink)' : 'var(--muted)' }}>✅ Selesai</div>
            </div>

          </div>

        </div>
      ))}
    </div>
  );
};

export default LaporanSaya;
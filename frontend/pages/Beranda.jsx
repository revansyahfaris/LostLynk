import React, { useState, useEffect } from 'react';

const Beranda = ({ onNavigate }) => {
  // State untuk balon teks interaktif si Linky Bot
  const [mascotText, setMascotText] = useState('Halo Sharon! Ada barang yang hilang hari ini? 🔍');
  const [blink, setBlink] = useState(false);

  // Efek kedipan mata si Linky setiap beberapa detik
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Kumpulan tips logistik lucu yang bakal diucapkan Linky saat diklik
  const handleMascotClick = () => {
    const tips = [
      'Tips Tekkom: Jangan tinggalin Arduino kamu sendirian di Lab Robotika ya! 🤖',
      'Psst! Kemarin ada yang nemuin Tumbler Pink di lantai 2 loh, punyamu bukan? 🌸',
      'Data Logistik Aman! Semua antrean disaring ketat pakai ID QUE-17! 🛡️',
      'Capek ngoding RPL? Sini istirahat dulu bareng aku! ☕',
      'Jangan lupa cek tab "Laporan Saya" buat ngeliat progress tracking kamu! 📈'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setMascotText(randomTip);
  };

  return (
    <div className="beranda-layout">
      {/* ANIMATION ENGINE (CSS KEYFRAMES PREMIUM) */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(14, 165, 233, 0); }
          100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }

        .beranda-layout {
          padding-top: 2rem;
          padding-bottom: 5rem;
          position: relative;
          animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Card Hero Baru yang Lebih Punchy */
        .hero-banner {
          background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
          padding: 4rem 2.5rem;
          border-radius: 32px;
          text-align: center;
          border: 1px solid rgba(14, 165, 233, 0.15);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.04);
          margin-bottom: 3.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Kartu Spek Statis yang Bisa Membal (Bounce Effect) */
        .stat-card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.01);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.03);
          border-color: var(--accent);
          box-shadow: 0 20px 35px rgba(14, 165, 233, 0.08);
        }

        /* Kontainer Asisten Robot */
        .mascot-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          z-index: 999;
          cursor: pointer;
        }

        /* Balon Teks si Linky Bot */
        .mascot-bubble {
          background: #1e293b;
          color: #ffffff;
          padding: 0.8rem 1.2rem;
          border-radius: 16px 16px 4px 16px;
          font-size: 0.8rem;
          font-weight: 500;
          max-width: 220px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        /* Tubuh Robot Linky */
        .linky-bot {
          width: 65px;
          height: 65px;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
          animation: float 4s infinite ease-in-out, pulseGlow 3s infinite;
          position: relative;
        }
        .linky-bot:hover {
          animation: wave 0.5s infinite alternate ease-in-out;
        }

        /* Mata Robot LED */
        .eye-container { display: flex; gap: 8px; margin-bottom: 4px; }
        .bot-eye {
          width: 10px;
          height: ${blink ? '2px' : '10px'};
          background: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 8px #34d399;
          transition: height 0.1s ease;
        }
        
        /* Senyum Robot */
        .bot-smile {
          width: 18px;
          height: 6px;
          border: 2px solid #ffffff;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }

        /* Antena Atas */
        .bot-antenna {
          position: absolute;
          top: -6px;
          width: 4px;
          height: 8px;
          background: #0ea5e9;
        }
        .bot-antenna-tip {
          position: absolute;
          top: -12px;
          width: 8px;
          height: 8px;
          background: #f43f5e;
          border-radius: 50%;
          box-shadow: 0 0 8px #f43f5e;
        }
      `}</style>

      {/* HERO BANNER SECTION */}
      <div className="container">
        <div className="hero-banner">
          <span style={{ background: '#ffffff', color: '#0284c7', padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            ⚡ HUB INDEKS LOGISTIK TEKNIK KOMPUTER UNDIP
          </span>

          <h1 style={{ fontSize: '2.6rem', fontWeight: '900', color: '#0f172a', marginTop: '1.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            Kehilangan Hardware Kampus? <br />
            Biar <span style={{ color: '#0ea5e9' }}>LostLynk</span> Yang Cari.
          </h1>

          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Mesin pencari terpusat untuk mengamankan aset laboratorium, modul praktikum tertanam, dan barang pribadi sivitas akademika Teknik Komputer Universitas Diponegoro.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('cari')} className="btn btn-accent" style={{ padding: '0.9rem 2.2rem', borderRadius: '14px', fontWeight: '700', transition: 'all 0.2s' }}>
              🔍 Temukan Barang Saya
            </button>
            <button onClick={() => onNavigate('lapor')} className="btn" style={{ padding: '0.9rem 2.2rem', borderRadius: '14px', fontWeight: '700', background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0' }}>
              📢 Ajukan Laporan Baru
            </button>
          </div>
        </div>

        {/* STATISTIK CARDS DENGAN BOUNCE HOVER */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>📊 Matriks Monitoring Kampus</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>

          <div className="stat-card" onClick={() => onNavigate('cari')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '850', color: '#0f172a' }}>13 data</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.2rem' }}>Total Antrean Aktif</div>
          </div>

          <div className="stat-card" onClick={() => onNavigate('cari')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '850', color: '#ef4444' }}>8 barang</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.2rem' }}>Masih Berstatus Hilang</div>
          </div>

          <div className="stat-card" onClick={() => onNavigate('cari')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '850', color: '#10b981' }}>2 sesi</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.2rem' }}>Selesai Diserahterimakan</div>
          </div>

        </div>
      </div>

      {/* INTERACTIVE MASCOT COMPONENT: LINKY BOT */}
      <div className="mascot-container" onClick={handleMascotClick}>
        <div className="mascot-bubble">
          {mascotText}
        </div>
        <div className="linky-bot">
          <div className="bot-antenna"></div>
          <div className="bot-antenna-tip"></div>
          <div className="eye-container">
            <div className="bot-eye"></div>
            <div className="bot-eye"></div>
          </div>
          <div className="bot-smile"></div>
        </div>
      </div>

    </div>
  );
};

export default Beranda;
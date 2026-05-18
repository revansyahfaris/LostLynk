import React, { useState, useEffect } from 'react';

const Beranda = ({ onNavigate }) => {
  // ---- 1. LOGIK ANIMASI TYPEWRITER ----
  const kataKunci = ['KTM.', 'Kunci Motor.', 'Dompet.', 'Flashdisk.'];
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const currentWord = kataKunci[wordIndex];
      if (!isDeleting) {
        // Sedang mengetik kata
        setText(currentWord.substring(0, text.length + 1));
        setTypingSpeed(100);
      } else {
        // Sedang menghapus kata
        setText(currentWord.substring(0, text.length - 1));
        setTypingSpeed(50);
      }

      // Jika kata sudah selesai diketik utuh
      if (!isDeleting && text === currentWord) {
        setTypingSpeed(1500); // Jeda sejenak sebelum mulai menghapus
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % kataKunci.length); // Pindah ke kata berikutnya
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingSpeed]);


  // ---- DATA STATISTIK DASHBOARD ----
  const stats = [
    { angka: '142', label: 'Barang Ditemukan', ikon: '📦' },
    { angka: '89', label: 'Laporan Aktif', ikon: '🔍' },
    { angka: '53', label: 'Sukses Kembali', ikon: '🤝' },
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>

      {/* SECTION HERO UTAMA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <span style={{ background: 'var(--accent-light)', color: 'var(--accent-mid)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            PORTAL RESMI UNDIP
          </span>

          {/* Judul dengan Animasi Mengetik Langsung */}
          <h1 style={{ fontSize: '2.4rem', margin: '1rem 0', lineHeight: '1.3', minHeight: '90px' }}>
            Temukan Kembali <br />
            <span style={{ color: 'var(--accent)', borderRight: '3px solid var(--accent)', paddingRight: '4px' }}>
              {text}
            </span>
          </h1>

          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
            Laporkan penemuan barang tercepat atau cari barang berhargamu yang hilang di seluruh area Universitas Diponegoro.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-accent" onClick={() => onNavigate('lapor')}>Lapor Penemuan</button>
            <button className="btn btn-secondary" onClick={() => onNavigate('cari')}>Cari di Galeri</button>
          </div>
        </div>

        {/* Ilustrasi Kanan dengan Animasi Hover Lembut */}
        <div
          style={{
            background: 'var(--cream)',
            borderRadius: '24px',
            height: '320px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid var(--accent-light)',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(14, 165, 233, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔗</span>
            <span style={{ color: 'var(--accent-mid)', fontWeight: 'bold', letterSpacing: '1px' }}>LOSTLYNK DASHBOARD</span>
          </div>
        </div>
      </div>

      {/* SECTION DASHBOARD STATISTIK KEREN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ fontSize: '2.2rem', background: 'var(--cream)', padding: '0.5rem', borderRadius: '12px' }}>
              {item.ikon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: '700', color: 'var(--ink)' }}>{item.angka}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', fontWeight: '500' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Beranda;